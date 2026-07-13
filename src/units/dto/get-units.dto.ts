export class UnitDto {
  id: string;
  code: string | null;
  name: string;
  type: string | null;
  view: string | null;
  price: number | null;
  status: string | null;
  publishToBroker: boolean | null;
  propertyType: string | null;
  noOfParkings: number | null;
  noOfBedroom: number | null;
  noOfBathrooms: number | null;
  noOfBalcony: number | null;
  isVilla: boolean | null;
  guestRoom: boolean | null;
  floor: string | null;
  buildingId: string | null;
  balconyArea: number | null;
  area: number | null;
  approvalStatus: string | null;
  apartmentType: string | null;
  city: string | null;
  category: string | null;
  balconyAvailability: string | null;
  availableDate: string | null;
  // Per-unit EOI/token deposit amount, distinct from the project-wide tokenAmount
  // returned by /units/preferences-get-all.
  eoiTokenAmount: number | null;
  // The unit's own image when Salesforce provides one; otherwise the parent
  // project's image, so consumers always have something to render.
  image: string | null;
}
