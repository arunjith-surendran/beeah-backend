export interface OnboardingDetailsPayload {
  SubType: string;
  AgencyName: string;
  Email: string;
  Phone: string;
  Type: string;
  Role: string;
  PoBox?: string;
  OwnerShipType?: string;
  CompanyReraRegistrationNumber?: string;
  CompanyReraExpiry?: string;
  AuthorizedWith?: string;
  HaveTrn?: string;
  AuthorizedSignatoryEmail?: string;
  AuthorizedSignatoryMobile?: string;
  AuthorizedSignatoryCountryCode?: string;
  AddressLine1?: string;
  AddressLine2?: string;
  City?: string;
  Country?: string;
  TradeLicenseNumber?: string;
  TradeLicenseExpiry?: string;
}

export interface BankDetailsPayload {
  BankName: string;
  BankAccountName: string;
  BankAccountNumber: string;
  IBANNumber: string;
  SwiftCode: string;
  CurrencyValue: string;
}

export interface OnboardingDocumentPayload {
  documentType: string;
  fileName: string;
  base64Data: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface CreateNewAccountPayload {
  onboarding: OnboardingDetailsPayload;
  bank: BankDetailsPayload;
  documents: OnboardingDocumentPayload[];
}

export interface CreateNewAccountApexResponse {
  success: boolean;
  onboardingId: string;
  message: string;
  bankId: string;
}
