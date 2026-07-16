import { SalesBookingCardPaymentDto } from './sales-booking-card-payment.dto';

export class SalesBookingPaymentOrderStatusResultDto {
  orderReference: string;
  // Raw N-Genius order state (e.g. CAPTURED, PURCHASED, FAILED, STARTED).
  state: string;
  isSuccessful: boolean;
  // Raw N-Genius order response from this status check - not hidden for this feature.
  gatewayResponse: unknown;
  payment: SalesBookingCardPaymentDto;
}
