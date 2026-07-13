// Exact wire shape for a single unit within a building group, as the Salesforce
// `getunits` Apex REST endpoint returns it - no buildingId here, it's per-group.
// Numeric-looking fields are typed string | number | null since Salesforce has been
// observed sending some of them (e.g. noOfBedroom) as either depending on the record.
interface RawUnit {
  unitView: string | null;
  unitType: string | null;
  unitPrice: string | null;
  unitName: string;
  unitId: string;
  unitCode: string | null;
  status: string | null;
  publishToBroker: boolean | null;
  propertyType: string | null;
  noOfParkings: string | number | null;
  noOfBedroom: string | number | null;
  noOfBathrooms: string | number | null;
  noOfBalcony: string | number | null;
  isVilla: boolean | null;
  guestRoom: boolean | null;
  floor: string | null;
  EOITokenAmount: string | number | null;
  documents: unknown[];
  city: string | null;
  category: string | null;
  balconyAvailability: string | null;
  availableDate: string | null;
  area: number | null;
  apartmentType: string | null;
  // Not present on every observed response - keep optional rather than assuming absence.
  balconyArea?: number | null;
  approvalStatus?: string | null;
}

interface UnitBuildingGroup {
  units: RawUnit[];
  buildingId: string | null;
}

export interface GetUnitsApexRawResponse {
  status: string;
  noOfUnits: number;
  message: string;
  data: UnitBuildingGroup[];
}

// Flattened shape the rest of the app relies on - buildingId merged onto each unit
// so callers don't need to know about the group-by-building wrapper.
export interface Unit extends RawUnit {
  buildingId: string | null;
}

export interface GetUnitsApexResponse {
  units: Unit[];
  status: string;
  noOfUnits: number;
  message: string;
}
