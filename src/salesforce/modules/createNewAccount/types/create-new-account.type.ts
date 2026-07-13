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

export interface PersonalDetailsPayload {
  Type: string;
  SubType: string;
  FirstName: string;
  LastName: string;
  Nationality: string;
  PassportNumber: string;
  PassportExpiry: string;
  EmiratesId: string;
  EidExpiry: string;
  CountryCode: string;
  Mobile: string;
  Email: string;
  AddressLine1: string;
  AddressLine2?: string;
  Country: string;
  City: string;
  PoBox?: string;
  SrerdNumber?: string;
  BrokerCardDetails?: string;
  SrerdExpiry?: string;
}

export interface LicensePartnerPayload {
  Name: string;
  Nationality: string;
  EmiratesId?: string;
  PassportNo: string;
  Role: string;
  SharePercentage?: number;
}

export interface BankDetailsPayload {
  BankName: string;
  BankAccountName: string;
  BankAccountNumber: string;
  BeneficiaryName: string;
  IBANNumber: string;
  SwiftCode: string;
  CurrencyValue: string;
  BankBranchName?: string;
  BankAddress?: string;
}

export interface OnboardingDocumentPayload {
  documentType: string;
  fileName: string;
  base64Data: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface CreateNewAccountPayload {
  onboarding?: OnboardingDetailsPayload;
  personalDetails?: PersonalDetailsPayload;
  bank: BankDetailsPayload;
  licensePartner?: LicensePartnerPayload[];
  documents: OnboardingDocumentPayload[];
}

export interface CreateNewAccountApexResponse {
  success: boolean;
  onboardingId: string;
  message: string;
  bankId: string;
}
