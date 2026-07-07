export const BOOKING_SOBJECT = 'Booking__c';

export const BOOKING_FIELDS = [
  'Id',
  'Name',
  'Unit__c',
  'Project__c',
  'Status__c',
];

export function bookingPath(id?: string): string {
  return id
    ? `/sobjects/${BOOKING_SOBJECT}/${id}`
    : `/sobjects/${BOOKING_SOBJECT}`;
}
