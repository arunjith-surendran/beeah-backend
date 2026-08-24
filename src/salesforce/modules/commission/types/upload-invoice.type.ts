// Independent copy of the `uploadDocument` Apex REST payload/response shape, scoped to
// the commission module - kept separate from `salesforce/modules/document/types` on
// purpose, matching the rest of this module's self-contained design.
export interface UploadInvoiceApexPayload {
  fileName: string;
  base64: string;
  recordId: string;
  documentType: string;
}

export interface UploadInvoiceApexResult {
  success: boolean;
  errorMessage: string | null;
  documentId: string;
  azureUrl: string;
}

export interface UploadInvoiceApexResponse {
  statusCode: number;
  result: UploadInvoiceApexResult;
  message: string;
}
