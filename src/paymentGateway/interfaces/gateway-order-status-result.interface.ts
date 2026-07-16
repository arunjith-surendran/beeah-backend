export interface GatewayOrderStatusResult {
  orderReference: string;
  // Raw N-Genius order state (e.g. CAPTURED, PURCHASED, FAILED, STARTED).
  state: string;
  isSuccessful: boolean;
  // Full raw N-Genius order response - the calling module stores this
  // itself (this service doesn't touch a database at all).
  gatewayResponse: object;
}
