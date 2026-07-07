export interface UploadDocumentApexPayload {
  fileName: string;
  base64: string;
  recordId: string;
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
