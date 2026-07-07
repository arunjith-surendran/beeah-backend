export class SalesBookingBuyerDto {
  tradeLicenseNumber: string | null;
  remarks: string | null;
  ownershipPercentage: string | null;
  nationality: string | null;
  nationalId: string | null;
  nationalExpiryDate: string | null;
  mobileCountryCode: string | null;
  mobile: string | null;
  middleName: string | null;
  leadId: string | null;
  lastName: string | null;
  fullNameEmiratesId: string | null;
  firstName: string | null;
  eoiId: string | null;
  emiratesIdExpiryDate: string | null;
  emiratesId: string | null;
  email: string | null;
  documents: unknown;
  dateOfBirth: string | null;
  countryOfResidence: string | null;
  countryOfRegistration: string | null;
  companyRegistrationPlace: string | null;
  companyRegistrationDate: string | null;
  companyName: string | null;
  companyEmail: string | null;
  companyTradeLicenseRegistrationType: string | null;
  city: string | null;
  buyerType: string | null;
  authorizedPersonName: string | null;
  authorizedPersonDesignation: string | null;
  address: string | null;
  accountId: string | null;
}

export class SalesBookingPaymentPlanDto {
  id: string | null;
  lineItems: unknown;
}

export class SalesBookingInventoryDataDto {
  unitPrice: number | null;
  unitName: string | null;
  projectName: string | null;
  projectId: string | null;
  inventoryId: string | null;
  buildingId: string | null;
}

export class SalesBookingDto {
  id: string;
  tokenAmount: number | null;
  signedRaFormUploaded: boolean | null;
  sellingPrice: number | null;
  secondaryBuyers: SalesBookingBuyerDto[];
  primaryBuyers: SalesBookingBuyerDto[];
  paymentPlan: SalesBookingPaymentPlanDto | null;
  opportunityName: string | null;
  modeOfPayment: string | null;
  leadId: string | null;
  isSpaSigned: boolean;
  isSpaFormSent: boolean | null;
  isRaFormSent: boolean;
  isRaFormGenerated: boolean | null;
  isKycConfirmed: boolean;
  isAmlConfirmed: boolean;
  inventoryData: SalesBookingInventoryDataDto | null;
  documents: unknown[];
  dealType: string | null;
  dealStatus: string | null;
  createdDate: string;
  commissions: unknown;
  bookingDate: string | null;
}
