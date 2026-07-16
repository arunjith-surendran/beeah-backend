/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { PaymentGatewayService } from '../../paymentGateway/service/payment-gateway.service';
import { GatewayOrderResultDto } from '../../paymentGateway/dto/gateway-order-result.dto';
import { SalesBookingCardPaymentRepository } from '../repository/sales-booking-card-payment.repository';
import { required } from '../../common/utils/validators.util';
import { CreateSalesBookingPaymentOrderDto } from '../dto/create-sales-booking-payment-order.dto';
import { SalesBookingPaymentOrderStatusResultDto } from '../dto/sales-booking-payment-order-status-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

const MERCHANT_REFERENCE_TAG = 'SALES_BOOKING';

const RECORDING_NOT_IMPLEMENTED_MESSAGE =
  'Payment captured by N-Genius, but not yet recorded in Salesforce - ' +
  'no sales-booking payment Apex REST endpoint exists yet. See ' +
  'SalesBookingPaymentService.recordDeposit.';

/**
 * Sales Booking payment orchestration - mirrors `EoiPaymentService` exactly,
 * proving `PaymentGatewayService` is genuinely reusable rather than
 * EOI-specific: same gateway, own `SalesBookingCardPayment` table (not the
 * EOI one). The one thing intentionally NOT implemented yet: what happens
 * in Salesforce when a booking payment succeeds. EOI's equivalent step
 * calls the `modeofpayments` Apex REST endpoint, which is hardcoded to an
 * `eoiId` and has no sales-booking equivalent in this codebase today.
 * `recordDeposit` below is a deliberate stub - it does NOT set
 * `recordedAt`, so nothing is silently marked "done" without an actual
 * Salesforce write, and the next status poll will try again once the real
 * Apex endpoint exists and this method is filled in.
 */
@Injectable()
export class SalesBookingPaymentService {
  private readonly logger = new Logger(SalesBookingPaymentService.name);

  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly salesBookingCardPaymentRepository: SalesBookingCardPaymentRepository,
  ) {}

  /**
   * Creates an N-Genius hosted-payment-page order for a sales booking's token amount.
   *
   * @param dto - Target booking id, amount (major currency units), and optional currency.
   * @returns The hosted payment page URL and order reference, wrapped in a `{ message, data }` envelope.
   */
  async createOrder(
    dto: CreateSalesBookingPaymentOrderDto,
  ): Promise<ResultWithMessage<GatewayOrderResultDto>> {
    const order = await this.paymentGatewayService.createOrder({
      merchantReferenceTag: MERCHANT_REFERENCE_TAG,
      entityId: dto.bookingId,
      amount: dto.amount,
      currency: dto.currency,
    });

    await this.salesBookingCardPaymentRepository.create({
      bookingId: dto.bookingId,
      amount: dto.amount,
      currency: dto.currency ?? 'AED',
      status: 'CREATED',
      orderReference: order.orderReference,
      merchantOrderReference: order.merchantOrderReference,
      gatewayResponse: order.gatewayResponse,
    });

    return {
      message: 'Payment order created',
      data: {
        paymentUrl: order.paymentUrl,
        orderReference: order.orderReference,
      },
    };
  }

  /**
   * Checks an N-Genius order's current state - called after the app's WebView
   * detects the redirect back from the hosted payment page, so success is
   * confirmed server-side rather than trusting the redirect alone.
   *
   * @param orderReference - N-Genius order reference returned by `createOrder`.
   * @returns The order's raw state plus a simplified success flag.
   */
  async getOrderStatus(
    orderReference: string,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderStatusResultDto>> {
    const result =
      await this.paymentGatewayService.getOrderStatus(orderReference);

    const payment =
      await this.salesBookingCardPaymentRepository.findByOrderReference(
        orderReference,
      );
    required(payment, 'Sales booking card payment');

    if (payment.status !== result.state) {
      await this.salesBookingCardPaymentRepository.updateByOrderReference(
        orderReference,
        { status: result.state, gatewayResponse: result.gatewayResponse },
      );
    }

    if (result.isSuccessful && !payment.recordedAt) {
      await this.recordDeposit(orderReference);
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
   * Stub for recording a successful booking payment in Salesforce - see the
   * class-level doc comment for why this doesn't call anything yet.
   *
   * @param orderReference - N-Genius order reference.
   */
  private async recordDeposit(orderReference: string): Promise<void> {
    this.logger.warn(
      `Sales booking payment ${orderReference} captured but not recorded in Salesforce - not implemented yet.`,
    );

    await this.salesBookingCardPaymentRepository.updateByOrderReference(
      orderReference,
      { errorMessage: RECORDING_NOT_IMPLEMENTED_MESSAGE },
    );
  }
}
