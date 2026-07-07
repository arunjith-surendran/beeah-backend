export interface CreateLeadApexPayload {
  Project_Id: string;
  countryCode: string;
  countryOfResident: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobilePhone: string;
  leadSource: string;
  recordTypeDeveloperName: string;
  createdByPortalUser: boolean;
}

export interface CreateLeadApexResponse {
  status: string;
  message: string;
  leadId: string;
}
