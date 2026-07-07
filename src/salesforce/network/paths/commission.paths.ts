export const COMMISSION_SOBJECT = 'Commission__c';

export const COMMISSION_FIELDS = [
  'Id',
  'Name',
  'Amount__c',
  'Status__c',
  'Booking__c',
];

export function commissionPath(id?: string): string {
  return id
    ? `/sobjects/${COMMISSION_SOBJECT}/${id}`
    : `/sobjects/${COMMISSION_SOBJECT}`;
}
