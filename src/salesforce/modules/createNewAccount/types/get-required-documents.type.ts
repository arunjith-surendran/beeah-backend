export interface RequiredDocumentRecord {
  subType: string;
  sortOrder: number;
  section: string;
  maxSizeMb: number;
  issueDateRequired: boolean;
  isSignatoryDocument: boolean;
  isRequired: boolean;
  isManagerDocument: boolean;
  isLicensePartnerDocument: boolean;
  isActive: boolean;
  expiryDateRequired: boolean;
  documentType: string;
  documentLabel: string;
  developerName: string;
  captureDates: boolean;
  allowedExtensions: string;
}

// Same envelope shape as GetFormDetailsApexResponse - `getFormDetails` is one
// generic Apex endpoint keyed by metadataType, so a `Broker Document Config`
// request comes back grouped by section (e.g. "Documents") exactly like a
// `Broker Field Config` one does, not the old dedicated endpoint's
// {status, noOfRecord, message, data} envelope.
export type GetRequiredDocumentsApexResponse = Record<
  string,
  RequiredDocumentRecord[]
>;
