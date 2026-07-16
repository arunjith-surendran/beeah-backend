import { SalesBookingCardPaymentDto } from './sales-booking-card-payment.dto';

export class SalesBookingPaymentOrderResultDto {
  // Present only if the order has a hosted-page link - a native N-Genius SDK
  // caller ignores this and uses `gatewayResponse` to launch the SDK instead.
  paymentUrl?: string;
  orderReference: string;
  merchantOrderReference: string;
  // Raw N-Genius order-creation response - not hidden for this feature.
  gatewayResponse: unknown;
  payment: SalesBookingCardPaymentDto;
}
