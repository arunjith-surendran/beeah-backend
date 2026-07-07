export interface GetAllSalesBookingApexPayload {
  userId: string;
}

export interface SalesBookingBuyer {
  tradeLicenseNumber: string | null;
  remarks: string | null;
  ownershipPercentage: string | null;
  nationality: string | null;
  nationalId: string | null;
  nationalExpiryDate: string | null;
  mobileCountryCode: string | null;
  mobile: string | null;
  MiddleName: string | null;
  leadId: string | null;
  lastName: string | null;
  fullnameEmiratesId: string | null;
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
  Company_Trade_License_Registration_Type: string | null;
  city: string | null;
  buyerType: string | null;
  authorizedPersonName: string | null;
  authorizedPersonDesignation: string | null;
  address: string | null;
  accountId: string | null;
}

export interface SalesBookingPaymentPlan {
  paymentPlanId: string | null;
  lineItems: unknown;
}

export interface SalesBookingInventoryData {
  unitPrice: number | null;
  unitName: string | null;
  projectName: string | null;
  projectId: string | null;
  inventoryId: string | null;
  buildingId: string | null;
}

export interface SalesBookingRecord {
  tokenAmount: number | null;
  SignedRAformUploaded: boolean | null;
  sellingPrice: string | null;
  secondaryBuyers: SalesBookingBuyer[];
  salesBookingId: string;
  primaryBuyers: SalesBookingBuyer[];
  paymentPlan: SalesBookingPaymentPlan | null;
  opportunityName: string | null;
  modeOfPayment: string | null;
  leadId: string | null;
  isSPASigned: boolean;
  isSPAFormSent: boolean | null;
  isRAFormSent: boolean;
  isRAFormgenerated: boolean | null;
  isKYCConfirm: boolean;
  isAMLConfirmed: boolean;
  inventoryData: SalesBookingInventoryData | null;
  documents: unknown[];
  dealType: string | null;
  dealStatus: string | null;
  createdDate: string;
  comissions: unknown;
  bookingDate: string | null;
}

export interface GetAllSalesBookingApexResponse {
  status: string;
  noOfRecords: number;
  message: string;
  data: SalesBookingRecord[];
}
