// Field names here match the client-facing DTOs exactly (camelCase) - a direct
// Salesforce Apex REST call confirmed the endpoint expects that same shape, not
// a PascalCase transformation. Sending PascalCase field names (e.g. "FirstName")
// still returns success but silently drops the data (e.g. bankId comes back null).

export interface CompanyInformationPayload {
  subtype: string;
  type: string;
  agencyName: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  city: string;
  poBox?: string;
  authorityRegisteredWith?: string;
  brokerLicenseNumber?: string;
  brokerLicenseExpiry?: string;
  haveTrn?: string;
  trnNumber?: string;
  ownerShipType?: string;
}

export interface SignatoryDetailsPayload {
  firstName: string;
  lastName: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  emiratesId: string;
  eidExpiry: string;
  authorizedSignatoryCountryCode: string;
  authorizedSignatoryMobile: string;
  authorizedSignatoryEmail: string;
  role: string;
  srerdNumber?: string;
  brokerCardDetails?: string;
  srerdExpiry?: string;
}

export interface PersonalDetailsPayload {
  type: string;
  subType: string;
  firstName: string;
  lastName: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  emiratesId: string;
  eidExpiry: string;
  countryCode: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  city: string;
  poBox?: string;
  srerdNumber?: string;
  brokerCardDetails?: string;
  srerdExpiry?: string;
}

export interface LicensePartnerPayload {
  name: string;
  nationality: string;
  emiratesId?: string;
  passportNo: string;
  role: string;
  sharePercentage?: number;
}

export interface ManagerPayload {
  name: string;
  nationality: string;
  passportNo: string;
  emiratesId?: string;
}

export interface EmployeePayload {
  name: string;
  email: string;
  phoneNumber: string;
  employeeId?: string;
}

export interface BankDetailsPayload {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  beneficiaryName: string;
  ibanNumber: string;
  swiftCode: string;
  currencyValue: string;
  bankBranchName?: string;
  bankAddress?: string;
}

// Documents are uploaded individually beforehand (POST /create-new-account/upload-document)
// - the final submission only references each one's returned documentId.
export interface OnboardingDocumentPayload {
  documentId: string;
}

export interface CreateNewAccountPayload {
  companyInformation?: CompanyInformationPayload;
  signatoryDetails?: SignatoryDetailsPayload;
  personalDetails?: PersonalDetailsPayload;
  bankInfo: BankDetailsPayload;
  licensePartners?: LicensePartnerPayload[];
  managers?: ManagerPayload[];
  employees?: EmployeePayload[];
  documents: OnboardingDocumentPayload[];
}

export interface CreateNewAccountApexResponse {
  success: boolean;
  onboardingId: string;
  message: string;
  bankId: string;
}
