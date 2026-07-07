export interface GetRequiredDocumentsApexPayload {
  subType: string;
}

export interface RequiredDocumentRecord {
  subType: string;
  sortOrder: number;
  section: string;
  maxSizeMb: number;
  isRequired: boolean;
  isActive: boolean;
  documentType: string;
  documentLabel: string;
  developerName: string;
  allowedExtensions: string;
}

export interface GetRequiredDocumentsApexResponse {
  status: string;
  noOfRecord: number;
  message: string;
  data: RequiredDocumentRecord[];
}
