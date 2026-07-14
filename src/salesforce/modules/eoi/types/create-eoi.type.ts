export interface UnitPreferencePayload {
  unitPrefernce: string;
  noOfUnits: number;
  eoiAmount: number;
}

export interface CreateEoiApexPayload {
  Project_Id: string;
  countryCode: string;
  countryOfResident?: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  mobilePhone: string;
  leadSource?: string;
  recordTypeDeveloperName: string;
  preferences: UnitPreferencePayload[];
  city?: string;
  country?: string;
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
