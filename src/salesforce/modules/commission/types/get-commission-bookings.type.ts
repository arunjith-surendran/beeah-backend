// Independent copy of the `allsalesbooking` Apex REST response shape, scoped to the
// commission module. Kept separate from `salesforce/modules/salesBooking/types` on
// purpose - the commission module doesn't depend on the sales-booking module.
export interface GetAllCommissionBookingsApexPayload {
  userId: string;
}

export interface CommissionBookingInventoryData {
  unitPrice: number | null;
  unitName: string | null;
  projectName: string | null;
  projectId: string | null;
  inventoryId: string | null;
  buildingId: string | null;
}

export interface CommissionRecord {
  name: string;
  invoiceStatus: string | null;
  commissionStatus: string | null;
  commissionPercent: number | null;
  commissionDate: string | null;
  commissionAmount: number | null;
}

export interface CommissionBookingRecord {
  salesBookingId: string;
  sellingPrice: string | null;
  inventoryData: CommissionBookingInventoryData | null;
  bookingDate: string | null;
  comissions: CommissionRecord[] | null;
}

export interface GetAllCommissionBookingsApexResponse {
  status: string;
  noOfRecords: number;
  message: string;
  data: CommissionBookingRecord[];
}
