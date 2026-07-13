export interface EoiRecord {
  Id: string;
  Name: string;
  EOI_Reference_No__c: string | null;
  Status__c: string | null;
  Project__c: string | null;
  Project_Name1__c: string | null;
  Buyer_Name__c: string | null;
  ActualName__c: string | null;
  First_Name__c: string | null;
  Last_Name__c: string | null;
  Mobile__c: string | null;
  EID_No__c: string | null;
  Agent_FirstName: string | null;
  Agent_LastName: string | null;
  Buyer_Type__c: string | null;
  Booking_Type__c: string | null;
  Company_Name__c: string | null;
  Company_Registration_Place__c: string | null;
  Company_Registration_Date__c: string | null;
  Trade_License_No__c: string | null;
  Trade_License_Expiry_Date__c: string | null;
  Email_Address__c: string | null;
  First_Applicant_Address__c: string | null;
  Country__c: string | null;
  City__c: string | null;
  Postal_Code__c: string | null;
  Currency__c: string | null;
  Total_Deposit_Amount__c: number | null;
  Unallocated_Amount__c: number | null;
  Token__c: string | null;
  Converted__c: boolean;
  Lead__c?: string | null;
  Account__c?: string | null;
  OwnerId: string | null;
  CreatedDate: string;
  LastModifiedDate: string;
  [key: string]: unknown;
}

export interface GetEoisApexResponse {
  isSuccess: boolean;
  message: string;
  eoiDetails: EoiRecord[];
  statusCode: number;
  TotalRecords: number;
}
