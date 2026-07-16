export interface GatewayOrderCreationResult {
  // Present only if the order has a hosted-page link - a native-SDK caller
  // can ignore this and use `gatewayResponse` directly instead.
  paymentUrl?: string;
  orderReference: string;
  merchantOrderReference: string;
  // Full raw N-Genius order response - the calling module stores this
  // itself (this service doesn't touch a database at all).
  gatewayResponse: object;
}
