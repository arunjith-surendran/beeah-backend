import { SalesBookingCardPaymentDto } from './sales-booking-card-payment.dto';

export class SalesBookingPaymentOrderResultDto {
  paymentUrl: string;
  orderReference: string;
  merchantOrderReference: string;
  // Raw N-Genius order-creation response - not hidden for this feature.
  gatewayResponse: unknown;
  payment: SalesBookingCardPaymentDto;
}
