export interface Unit {
  unitView: string | null;
  unitType: string | null;
  unitPrice: string | null;
  unitName: string;
  unitId: string;
  unitCode: string | null;
  status: string | null;
  propertyType: string | null;
  noOfBedroom: number | null;
  isVilla: boolean | null;
  guestRoom: boolean | null;
  floor: string | null;
  documents: unknown[];
  buildingId: string | null;
  balconyArea: number | null;
  area: number | null;
  approvalStatus: string | null;
  apartmentType: string | null;
}

export interface GetUnitsApexResponse {
  units: Unit[];
  status: string;
  noOfUnits: number;
  message: string;
}
