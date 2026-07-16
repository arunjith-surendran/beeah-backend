export interface GatewayOrderCreationResult {
  paymentUrl: string;
  orderReference: string;
  merchantOrderReference: string;
  // Full raw N-Genius order response - the calling module stores this
  // itself (this service doesn't touch a database at all).
  gatewayResponse: object;
}
