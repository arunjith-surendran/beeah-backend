export interface CreateSalesOfferApexPayload {
  name: string;
  opportunityId: string;
  description?: string;
  customerName: string;
  customerEmail: string;
  sellingPrice: number;
}

export interface CreateSalesOfferApexResponse {
  Status: string;
  salesOfferId: string;
  message: string;
}
