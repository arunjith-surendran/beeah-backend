/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import type { EoiCardPayment, User } from '@prisma/client';
import { PaymentGatewayService } from '../../paymentGateway/service/payment-gateway.service';
import { GatewayOrderResultDto } from '../../paymentGateway/dto/gateway-order-result.dto';
import { EoiCardPaymentRepository } from '../repository/eoi-card-payment.repository';
import { EoiService } from '../../eoi/service/eoi.service';
import { PaymentMode } from '../../eoi/dto/payment-mode.enum';
import { required } from '../../common/utils/validators.util';
import { CreateEoiPaymentOrderDto } from '../dto/create-eoi-payment-order.dto';
import { EoiPaymentOrderStatusResultDto } from '../dto/eoi-payment-order-status-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

const MERCHANT_REFERENCE_TAG = 'EOI';

/**
 * EOI-specific payment orchestration - delegates the actual N-Genius
 * mechanics to `PaymentGatewayService` (which never touches a database),
 * stores the result in its own `EoiCardPayment` table, and owns the one
 * thing that's genuinely EOI's business, not the gateway's: what
 * "successful payment" means here, which is recording a "Credit Card"
 * mode-of-payment entry against the EOI in Salesforce. Only card payments
 * are stored in our backend at all - manual (Bank Transfer/Cheque/Cash)
 * entries go straight to Salesforce via `EoiService.createModeOfPayment`
 * with no local record.
 */
@Injectable()
export class EoiPaymentService {
  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly eoiCardPaymentRepository: EoiCardPaymentRepository,
    private readonly eoiService: EoiService,
  ) {}

  /**
   * Creates an N-Genius order for an EOI's deposit amount. Idempotent on
   * `dto.idempotencyKey`: replaying the same key returns the order already
   * created for it instead of creating a second one, so a double-tap or
   * network retry can't double-charge.
   *
   * @param dto - Target EOI id, amount (major currency units), idempotency key, and optional currency.
   * @returns The order reference, raw gateway response (for a native SDK), and hosted-page URL (if any), wrapped in a `{ message, data }` envelope.
   */
  async createOrder(
    dto: CreateEoiPaymentOrderDto,
  ): Promise<ResultWithMessage<GatewayOrderResultDto>> {
    const existing = await this.eoiCardPaymentRepository.findByIdempotencyKey(
      dto.idempotencyKey,
    );
    if (existing) {
      return {
        message: 'Payment order created',
        data: {
          paymentUrl: this.paymentGatewayService.extractPaymentUrl(
            existing.gatewayResponse,
          ),
          orderReference: existing.orderReference,
          merchantOrderReference: existing.merchantOrderReference,
          gatewayResponse: existing.gatewayResponse,
        },
      };
    }

    const order = await this.paymentGatewayService.createOrder({
      merchantReferenceTag: MERCHANT_REFERENCE_TAG,
      entityId: dto.eoiId,
      amount: dto.amount,
      currency: dto.currency,
    });

    await this.eoiCardPaymentRepository.create({
      eoiId: dto.eoiId,
      amount: dto.amount,
      currency: dto.currency ?? 'AED',
      status: 'CREATED',
      orderReference: order.orderReference,
      merchantOrderReference: order.merchantOrderReference,
      idempotencyKey: dto.idempotencyKey,
      gatewayResponse: order.gatewayResponse,
    });

    return {
      message: 'Payment order created',
      data: {
        paymentUrl: order.paymentUrl,
        orderReference: order.orderReference,
        merchantOrderReference: order.merchantOrderReference,
        gatewayResponse: order.gatewayResponse,
      },
    };
  }

  /**
   * Checks an N-Genius order's current state - called after the app's WebView
   * detects the redirect back from the hosted payment page, so success is
   * confirmed server-side rather than trusting the redirect alone. On first
   * confirmed success, records the deposit as a "Credit Card" mode-of-payment
   * entry against the order's EOI in Salesforce.
   *
   * @param user - Authenticated user, used to record the mode-of-payment entry.
   * @param orderReference - N-Genius order reference returned by `createOrder`.
   * @returns The order's raw state plus a simplified success flag.
   */
  async getOrderStatus(
    user: User,
    orderReference: string,
  ): Promise<ResultWithMessage<EoiPaymentOrderStatusResultDto>> {
    const result =
      await this.paymentGatewayService.getOrderStatus(orderReference);

    const payment =
      await this.eoiCardPaymentRepository.findByOrderReference(orderReference);
    required(payment, 'EOI card payment');

    if (payment.status !== result.state) {
      await this.eoiCardPaymentRepository.updateByOrderReference(
        orderReference,
        { status: result.state, gatewayResponse: result.gatewayResponse },
      );
    }

    // Guarded by recordedAt so re-polling the same order never creates
    // duplicate mode-of-payment entries.
    if (result.isSuccessful && !payment.recordedAt) {
      await this.recordDeposit(user, payment, orderReference);
    }

    return {
      message: 'Order status fetched',
      data: {
        orderReference: result.orderReference,
        state: result.state,
        isSuccessful: result.isSuccessful,
      },
    };
  }

  /**
   * Records a successful card order's deposit against its EOI in Salesforce,
   * then stamps the `EoiCardPayment` row with the outcome either way so a
   * Salesforce failure can be retried on the next status poll instead of
   * silently swallowed.
   *
   * @param user - Authenticated user, used to record the mode-of-payment entry.
   * @param payment - The order's stored card payment row.
   * @param orderReference - N-Genius order reference.
   */
  private async recordDeposit(
    user: User,
    payment: EoiCardPayment,
    orderReference: string,
  ): Promise<void> {
    try {
      const recorded = await this.eoiService.createModeOfPayment(
        user,
        payment.eoiId,
        {
          modeOfPayments: [
            {
              paymentMode: PaymentMode.CreditCard,
              currencyType: payment.currency,
              depositAmount: payment.amount.toNumber(),
              bankName: null,
              transactionDate: new Date().toISOString().slice(0, 10),
              transactionNo: orderReference,
              chequeNumber: null,
              chequeDate: null,
              thirdPartyCheque: 'No',
            },
          ],
        },
      );

      await this.eoiCardPaymentRepository.updateByOrderReference(
        orderReference,
        {
          salesforceRecordId: recorded.data.recordId,
          recordedAt: new Date(),
        },
      );
    } catch (error) {
      await this.eoiCardPaymentRepository.updateByOrderReference(
        orderReference,
        {
          errorMessage: error instanceof Error ? error.message : String(error),
        },
      );
      throw error;
    }
  }
}
