export interface ModeOfPaymentPayload {
  payment_Mode: string;
  currencyType: string;
  depositAmount: number;
  bankName: string | null;
  transactionDate: string | null;
  transactionNo: string | null;
  chequeNumber: string | null;
  chequeDate: string | null;
  thirdPartyCheque: string;
}

export interface CreateModeOfPaymentApexPayload {
  eoiId: string;
  modeOfPayments: ModeOfPaymentPayload[];
}

export interface CreateModeOfPaymentApexResponse {
  statusCode: number;
  recordId: string;
  message: string;
  errorDetails: string | null;
}
