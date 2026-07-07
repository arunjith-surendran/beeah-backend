export class PaymentPlanDto {
  id: string;
  projectId: string | null;
  planName: string | null;
  status: string | null;
  paymentTerms: string | null;
  totalDiscountPercent: number | null;
  marketingName: string | null;
  marketingDescription: string | null;
  customerUnitId: string | null;
}
