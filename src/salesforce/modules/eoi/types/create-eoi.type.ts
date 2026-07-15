export interface UnitPreferencePayload {
  unitType: string;
  noOfUnits: number;
  eoiAmount: number;
}

export interface CreateEoiApexPayload {
  // Required fields (actually present in JSON)
  projectId: string;
  buyer_Type: string;
  FirstName: string;
  LastName: string;
  email: string;
  countryCode: string;
  mobileNo: number;
  countryOfResidence: string;
  city: string;
  createdByPortalUser: boolean;
  unitPreferences: UnitPreferencePayload[];

  // Optional fields (present in JSON)
  middleName?: string;
  country?: string;
  leadSource?: string;
  recordTypeDeveloperName?: string;
  nationality?: string;
  passportExpiry?: string;
  eidNo?: string;
  emiratesExpiry?: string;
  firstApplicantAddress?: string;
  postalCode?: string;
}

export interface CreateEoiApexResponse {
  statusCode: number;
  recordId: string;
  message: string;
  leadId: string;
  errorDetails: string | null;
  AccountId: string;
}
