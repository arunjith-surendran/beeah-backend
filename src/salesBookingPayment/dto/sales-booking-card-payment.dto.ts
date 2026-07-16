// Full stored row, unfiltered - Sales Booking payment responses deliberately
// don't hide anything (unlike EOI's narrower public contract), since this
// feature is still new and its Salesforce-recording step isn't built yet -
// callers need to see raw status/errorMessage/gatewayResponse to debug it.
export class SalesBookingCardPaymentDto {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  orderReference: string;
  merchantOrderReference: string;
  gatewayResponse: unknown;
  salesforceRecordId: string | null;
  errorMessage: string | null;
  recordedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
