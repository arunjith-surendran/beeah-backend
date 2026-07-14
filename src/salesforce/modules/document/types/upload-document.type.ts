export interface UploadDocumentApexPayload {
  fileName: string;
  base64: string;
  // Omitted for onboarding uploads (create-new-account), which happen before any
  // Salesforce record exists yet - the document is attached to the record created
  // by the create-new-account submission that follows, via its returned documentId.
  recordId?: string;
  documentType: string;
}

export interface UploadDocumentApexResult {
  success: boolean;
  errorMessage: string | null;
  documentId: string;
  azureUrl: string;
}

export interface UploadDocumentApexResponse {
  statusCode: number;
  result: UploadDocumentApexResult;
  message: string;
}
