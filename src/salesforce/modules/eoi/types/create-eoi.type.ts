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

  // Company buyer fields (present when buyer_Type is "Company")
  Company_Name?: string;
  Company_Registration_Place?: string;
  Company_Registration_Date?: string;
  Trade_License_Number?: string;
  Trade_License_Expiry_Date?: string;
  Mobile_Country_Code?: string;
  Company_Email?: string;
  VAT_Certificate_No?: string;
  Representative_First_Name?: string;
  Signatory_Mobile?: string;
  Signatory_Mobile_Country_Code?: string;
  Signatory_Email?: string;
}

export interface CreateEoiApexResponse {
  statusCode: number;
  recordId: string;
  message: string;
  leadId: string;
  errorDetails: string | null;
  AccountId: string;
}
