/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import type { SalesBookingCardPayment } from '@prisma/client';
import { PaymentGatewayService } from '../../paymentGateway/service/payment-gateway.service';
import { SalesBookingCardPaymentRepository } from '../repository/sales-booking-card-payment.repository';
import { required } from '../../common/utils/validators.util';
import { CreateSalesBookingPaymentOrderDto } from '../dto/create-sales-booking-payment-order.dto';
import { SalesBookingPaymentOrderResultDto } from '../dto/sales-booking-payment-order-result.dto';
import { SalesBookingPaymentOrderStatusResultDto } from '../dto/sales-booking-payment-order-status-result.dto';
import { SalesBookingCardPaymentDto } from '../dto/sales-booking-card-payment.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

// Short and hyphen/underscore-free on purpose - PaymentGatewayService
// sanitizes and truncates this to fit N-Genius's 37-char limit regardless,
// but keeping the tag itself short leaves more of that budget for the
// entityId and the uniqueness suffix instead of getting silently truncated.
const MERCHANT_REFERENCE_TAG = 'SB';

const RECORDING_NOT_IMPLEMENTED_MESSAGE =
  'Payment captured by N-Genius, but not yet recorded in Salesforce - ' +
  'no sales-booking payment Apex REST endpoint exists yet. See ' +
  'SalesBookingPaymentService.recordDeposit.';

/**
 * Sales Booking payment orchestration - mirrors `EoiPaymentService` exactly,
 * proving `PaymentGatewayService` is genuinely reusable rather than
 * EOI-specific: same gateway, own `SalesBookingCardPayment` table (not the
 * EOI one). Unlike EOI's narrower public contract, both endpoints here
 * return the full raw N-Genius gateway response plus the full stored
 * payment row, unfiltered - this feature is still new and its
 * Salesforce-recording step isn't built yet, so callers need full
 * visibility to debug it rather than a trimmed summary.
 *
 * The one thing intentionally NOT implemented yet: what happens in
 * Salesforce when a booking payment succeeds. EOI's equivalent step calls
 * the `modeofpayments` Apex REST endpoint, which is hardcoded to an
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
   * Idempotent on `dto.idempotencyKey`: replaying the same key returns the
   * order already created for it instead of creating a second one, so a
   * double-tap or network retry can't double-charge.
   *
   * @param dto - Amount (major currency units), idempotency key, and optional currency.
   * @returns The full N-Genius order-creation response plus the stored payment row, wrapped in a `{ message, data }` envelope.
   */
  async createOrder(
    dto: CreateSalesBookingPaymentOrderDto,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderResultDto>> {
    const existing =
      await this.salesBookingCardPaymentRepository.findByIdempotencyKey(
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
          payment: this.toPaymentDto(existing),
        },
      };
    }

    const order = await this.paymentGatewayService.createOrder({
      merchantReferenceTag: MERCHANT_REFERENCE_TAG,
      // No booking record to key off anymore - the idempotency key is the
      // only per-order identifier left, so it doubles as the traceability
      // label's entityId too.
      entityId: dto.idempotencyKey,
      amount: dto.amount,
      currency: dto.currency,
    });

    const payment = await this.salesBookingCardPaymentRepository.create({
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
        payment: this.toPaymentDto(payment),
      },
    };
  }

  /**
   * Checks an N-Genius order's current state - called after the app's WebView
   * detects the redirect back from the hosted payment page, so success is
   * confirmed server-side rather than trusting the redirect alone.
   *
   * @param orderReference - N-Genius order reference returned by `createOrder`.
   * @returns The full N-Genius status response plus the stored payment row, wrapped in a `{ message, data }` envelope.
   */
  async getOrderStatus(
    orderReference: string,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderStatusResultDto>> {
    const result =
      await this.paymentGatewayService.getOrderStatus(orderReference);

    let payment =
      await this.salesBookingCardPaymentRepository.findByOrderReference(
        orderReference,
      );
    required(payment, 'Sales booking card payment');

    if (payment.status !== result.state) {
      payment =
        await this.salesBookingCardPaymentRepository.updateByOrderReference(
          orderReference,
          { status: result.state, gatewayResponse: result.gatewayResponse },
        );
    }

    if (result.isSuccessful && !payment.recordedAt) {
      payment = await this.recordDeposit(orderReference);
    }

    return {
      message: 'Order status fetched',
      data: {
        orderReference: result.orderReference,
        state: result.state,
        isSuccessful: result.isSuccessful,
        gatewayResponse: result.gatewayResponse,
        payment: this.toPaymentDto(payment),
      },
    };
  }

  /**
   * Stub for recording a successful booking payment in Salesforce - see the
   * class-level doc comment for why this doesn't call anything yet.
   *
   * @param orderReference - N-Genius order reference.
   * @returns The updated payment row.
   */
  private async recordDeposit(
    orderReference: string,
  ): Promise<SalesBookingCardPayment> {
    this.logger.warn(
      `Sales booking payment ${orderReference} captured but not recorded in Salesforce - not implemented yet.`,
    );

    return this.salesBookingCardPaymentRepository.updateByOrderReference(
      orderReference,
      { errorMessage: RECORDING_NOT_IMPLEMENTED_MESSAGE },
    );
  }

  /**
   * Maps the stored Prisma row to its public DTO shape (Decimal -> number).
   *
   * @param payment - Stored payment row.
   * @returns The row shaped for API consumers.
   */
  private toPaymentDto(
    payment: SalesBookingCardPayment,
  ): SalesBookingCardPaymentDto {
    return {
      id: payment.id,
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      status: payment.status,
      orderReference: payment.orderReference,
      merchantOrderReference: payment.merchantOrderReference,
      gatewayResponse: payment.gatewayResponse,
      salesforceRecordId: payment.salesforceRecordId,
      errorMessage: payment.errorMessage,
      recordedAt: payment.recordedAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
