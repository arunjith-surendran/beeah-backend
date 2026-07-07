export interface GetPaymentPlanApexPayload {
  buildingId: string;
}

export interface PaymentPlanRecord {
  Total_Discount_Percent: number | null;
  status: string | null;
  Project_Id: string | null;
  PlanName: string | null;
  PaymentTerms: string | null;
  Payment_Plan_Id: string;
  Marketing_Name: string | null;
  Marketing_Description: string | null;
  CustomerUnitId: string | null;
}

export interface GetPaymentPlanApexResponse {
  status: string;
  message: string;
  data: PaymentPlanRecord[];
}
