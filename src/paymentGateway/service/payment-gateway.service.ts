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

// N-Genius rejects merchantOrderReference that doesn't match this exactly
// (confirmed against the live sandbox, not assumed from docs) - letters,
// digits, and hyphens only, 1-37 characters.
const MERCHANT_ORDER_REFERENCE_PATTERN = /[^a-zA-Z0-9-]/g;
const MERCHANT_ORDER_REFERENCE_MAX_LENGTH = 37;

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
    const merchantOrderReference = this.buildMerchantOrderReference(request);

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

  /**
   * Builds a merchantOrderReference that's guaranteed to satisfy N-Genius's
   * constraint regardless of what the caller's tag/entityId look like -
   * strips any character outside [a-zA-Z0-9-] (e.g. an underscore in a tag,
   * or stray characters in an id) and truncates to 37 characters. This is
   * purely a traceability label on N-Genius's own dashboard, not used for
   * lookups on our side (we key off N-Genius's own `orderReference` for
   * that), so sanitizing/truncating it can never lose real data.
   *
   * @param request - Tag and entity id to build the reference from.
   * @returns A merchantOrderReference safe to send to N-Genius.
   */
  private buildMerchantOrderReference(
    request: CreateGatewayOrderRequest,
  ): string {
    const tag = request.merchantReferenceTag.replace(
      MERCHANT_ORDER_REFERENCE_PATTERN,
      '',
    );
    const entityId = request.entityId.replace(
      MERCHANT_ORDER_REFERENCE_PATTERN,
      '',
    );
    // Base36 instead of decimal - same uniqueness, far fewer characters, so
    // more of the budget goes to the tag/entityId instead of the timestamp.
    const suffix = Date.now().toString(36);

    return `${tag}-${entityId}-${suffix}`.slice(
      0,
      MERCHANT_ORDER_REFERENCE_MAX_LENGTH,
    );
  }
}
