export interface UnitPreferencePayload {
  unitType: string;
  noOfUnits: number;
  eoiAmount: number;
}

export interface CreateEoiApexPayload {
  booking_Type: string;
  projectId: string;
  buyer_Type: string;
  property_Type: string;
  userId: string;
  createdByPortalUser: boolean;
  leadId?: string;
  salutation: string;
  FirstName: string;
  middleName?: string;
  LastName: string;
  email: string;
  countryCode: string;
  mobileNo: number;
  countryOfResidence: string;
  country?: string;
  address: string;
  firstApplicantAddress?: string;
  city: string;
  leadSource?: string;
  recordTypeDeveloperName?: string;
  companyName?: string;
  companyRegistrationPlace?: string;
  companyRegistrationDate?: string;
  tradeLicenseNo?: string;
  tradeLicenseExpiryDate?: string;
  tradeLicenseIssueDate?: string;
  companyEmail?: string;
  corpAddress?: string;
  corpCountry?: string;
  corpCity?: string;
  corpPostalCode?: string;
  representativeSalutation?: string;
  representativeFirstName?: string;
  representativeLastName?: string;
  representativeEmail?: string;
  representativeCountryCode?: string;
  representativeMobileNo?: number;
  nationality?: string;
  passportExpiry?: string;
  eidNo?: string;
  emiratesExpiry?: string;
  postalCode?: string;
  vatCertificateNo?: string;
  unitPreferences: UnitPreferencePayload[];
}

export interface CreateEoiApexResponse {
  statusCode: number;
  recordId: string;
  message: string;
  leadId: string;
  errorDetails: string | null;
  AccountId: string;
}
