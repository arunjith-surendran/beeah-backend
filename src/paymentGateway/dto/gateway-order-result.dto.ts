export class GatewayOrderResultDto {
  // Present only if the order has a hosted-page link - a native N-Genius SDK
  // caller ignores this and uses `gatewayResponse` to launch the SDK instead.
  paymentUrl?: string;
  orderReference: string;
  merchantOrderReference: string;
  // Raw N-Genius order-creation response, needed to launch a native SDK.
  gatewayResponse: unknown;
}
