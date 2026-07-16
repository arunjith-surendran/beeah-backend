import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NgeniusClient } from '../network/ngenius.client';
import { required } from '../../common/utils/validators.util';
import { CreateGatewayOrderRequest } from '../interfaces/create-gateway-order-request.interface';
import { GatewayOrderCreationResult } from '../interfaces/gateway-order-creation-result.interface';
import { GatewayOrderStatusResult } from '../interfaces/gateway-order-status-result.interface';

// N-Genius order states that mean the card charge actually went through.
const SUCCESSFUL_STATES = new Set([
  'CAPTURED',
  'PURCHASED',
  'AUTHORISED',
  'SUCCESS',
]);

const DEFAULT_CURRENCY = 'AED';

/**
 * Reusable N-Genius hosted-payment-page integration - purely mechanics, no
 * database access at all. Creates orders and checks their status; each
 * calling module (EOI payment, Sales Booking payment, ...) stores the
 * result in its own table and decides what "successful payment" means for
 * itself. That split - this module only ever talks to N-Genius, never to
 * Prisma - is what makes it reusable without forcing every consumer to
 * share one payments table.
 */
@Injectable()
export class PaymentGatewayService {
  constructor(
    private readonly ngeniusClient: NgeniusClient,
    private readonly config: ConfigService,
  ) {}

  /**
   * Creates an N-Genius hosted-payment-page order for any amount.
   *
   * @param request - How much, and a tag identifying what it's for (for traceability only).
   * @returns The hosted payment page URL, order reference, and raw gateway response for the caller to store.
   */
  async createOrder(
    request: CreateGatewayOrderRequest,
  ): Promise<GatewayOrderCreationResult> {
    const redirectUrl = this.config.getOrThrow<string>('NGENIUS_REDIRECT_URL');
    const currency = request.currency ?? DEFAULT_CURRENCY;
    const merchantOrderReference = `${request.merchantReferenceTag}-${request.entityId}-${Date.now()}`;

    const order = await this.ngeniusClient.createOrder({
      action: 'SALE',
      amount: {
        currencyCode: currency,
        value: Math.round(request.amount * 100),
      },
      merchantOrderReference,
      merchantAttributes: {
        redirectUrl,
        skipConfirmationPage: true,
      },
    });

    const paymentUrl = order._links.payment?.href;
    required(paymentUrl, 'N-Genius payment URL');

    return {
      paymentUrl,
      orderReference: order.reference,
      merchantOrderReference,
      gatewayResponse: order,
    };
  }

  /**
   * Checks an N-Genius order's current state.
   *
   * @param orderReference - N-Genius order reference returned by `createOrder`.
   * @returns The order's raw state, a simplified success flag, and the raw gateway response for the caller to store.
   */
  async getOrderStatus(
    orderReference: string,
  ): Promise<GatewayOrderStatusResult> {
    required(orderReference, 'orderReference');

    const order = await this.ngeniusClient.getOrder(orderReference);
    // The order's actual payment state lives in _embedded.payment[0], not on
    // the order object itself.
    const state = order._embedded?.payment?.[0]?.state ?? 'UNKNOWN';
    const isSuccessful = SUCCESSFUL_STATES.has(state.toUpperCase());

    return {
      orderReference: order.reference,
      state,
      isSuccessful,
      gatewayResponse: order,
    };
  }
}
