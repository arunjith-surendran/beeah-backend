// The full set of commission status values confirmed against Salesforce (spans both the
// approval chain - Eligibility/Approved by X/Rejected by X/On Hold/Pending Approval/
// Approved/Rejected/Evaluated - Not Eligible Draft - and the post-approval invoice/payment
// flow - Pending Invoice Upload by Broker/Invoice Verification Pending/Pending Payment/
// Payment Completed). Kept as a documentation reference only - `status` is typed `string`
// since Salesforce could introduce new picklist values we haven't seen yet.
export const KNOWN_COMMISSION_STATUSES = [
  'Eligibility Criteria Met',
  'Eligibility Criteria Not Met',
  'Approved by Sales Ops Admin Executive',
  'Rejected by Sales Ops Admin Executive',
  'Approved by HOD CRM Sales Ops Admin',
  'Rejected by HOD CRM Sales Ops Admin',
  'Approved by HOD Sales',
  'Rejected by HOD Sales',
  'Approved by CSBDO',
  'Rejected by CSBDO',
  'Approved by Executive Director Finance',
  'Rejected by Executive Director Finance',
  'Pending Payment',
  'Pending Invoice Upload by Broker',
  'Invoice Verification Pending',
  'Payment Completed',
  'On Hold',
  'Rejected',
  'Evaluated - Not Eligible Draft',
  'Pending Approval',
  'Approved',
] as const;

// Matches the `Chip` component's `variant` prop in beeah-brokerapp - sending this from
// the backend means the frontend never has to hardcode a status -> color mapping.
export type CommissionStatusVariant = 'success' | 'error' | 'warning';

export class CommissionDto {
  id: string;
  unitName: string;
  dateOfBooking: string;
  project: string;
  price: number;
  status: string;
  statusVariant: CommissionStatusVariant;
  canUploadInvoice: boolean;
  commissionRate: string;
  commissionAmount: number;
  commissionReceived: number;
  commissionPending: number;
}
