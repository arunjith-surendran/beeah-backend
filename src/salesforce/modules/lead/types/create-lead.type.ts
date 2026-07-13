export interface CreateLeadApexPayload {
  interestedProject?: string;
  countryCode: string;
  countryOfResident: string;
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  mobilePhone: string;
  recordTypeDeveloperName: string;
  createdByPortalUser: boolean;
  company?: string;
  interestedPropertyType?: string;
  // Unconfirmed against the actual Apex wrapper class - if this doesn't persist,
  // it's the most likely name to double check.
  noOfBedroom?: string;
  preferredLanguage?: string;
  budgetRange?: string;
  description?: string;
}

export interface CreateLeadApexResponse {
  status: string;
  message: string;
  leadId: string;
}
