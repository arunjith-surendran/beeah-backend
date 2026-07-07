export interface LeadRecord {
  Id: string;
  Lead_Id__c: string | null;
  Name: string;
  FirstName: string | null;
  LastName: string;
  Email: string | null;
  MobilePhone: string | null;
  Mobile_Country_Code__c: string | null;
  Status: string | null;
  LeadSource: string | null;
  OwnerId: string | null;
  Owner_Name__c: string | null;
  Account__c: string | null;
  Display_Project__c: string | null;
  CurrencyIsoCode: string | null;
  PhotoUrl: string | null;
  IsConverted: boolean;
  CreatedDate: string;
  LastModifiedDate: string;
  Assigned_Date__c: string | null;
  [key: string]: unknown;
}

export interface GetLeadsApexResponse {
  isSuccess: boolean;
  message: string;
  LeadDetails: LeadRecord[];
  statusCode: number;
  TotalRecords: number;
}
