export class SalesBookingPaymentOrderStatusResultDto {
  orderReference: string;
  // Raw N-Genius order state (e.g. CAPTURED, PURCHASED, FAILED, STARTED).
  state: string;
  isSuccessful: boolean;
}
