export interface ProjectMarketingDocument {
  ownerName: string;
  ownerId: string;
  documentUrl1: string | null;
  documentUrl2: string | null;
  documentType: string;
  documentName: string;
  documentId: string;
  createdDate: string;
}

export interface ProjectDetail {
  startingPrice: number | null;
  startingArea: number | null;
  reraProjectNo: string | null;
  reraProjectName: string | null;
  propertyType: string | null;
  propertyStatus: string | null;
  projectNameArabic: string | null;
  projectName: string;
  projectId: string;
  projectCode: string | null;
  postalCode: string | null;
  marketingOneLiner: string | null;
  marketingLongDescription: string | null;
  marketingDocumentList: ProjectMarketingDocument[];
  googleMapsLocation: string | null;
  entityName: string | null;
  createdDate: string;
  country: string | null;
  city: string | null;
  anticipatedHandoverDate: string | null;
  anticipatedCompletionDate: string | null;
  amenities: string | null;
  addressLine2: string | null;
  addressLine1: string | null;
  actualConstructionStartDate: string | null;
}

export interface GetProjectApexResponse {
  totalRecords: number;
  statusCode: number;
  projectDetails: ProjectDetail[];
  message: string;
}
