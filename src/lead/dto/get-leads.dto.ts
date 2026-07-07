export class LeadDetailDto {
  id: string;
  leadId: string | null;
  name: string;
  firstName: string | null;
  lastName: string;
  email: string | null;
  mobilePhone: string | null;
  mobileCountryCode: string | null;
  status: string | null;
  leadSource: string | null;
  ownerId: string | null;
  ownerName: string | null;
  accountId: string | null;
  displayProject: string | null;
  currencyIsoCode: string | null;
  photoUrl: string | null;
  isConverted: boolean;
  createdDate: string;
  lastModifiedDate: string;
  assignedDate: string | null;
}
