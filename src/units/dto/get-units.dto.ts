export class UnitDto {
  id: string;
  code: string | null;
  name: string;
  type: string | null;
  view: string | null;
  price: number | null;
  status: string | null;
  propertyType: string | null;
  noOfBedroom: number | null;
  isVilla: boolean | null;
  guestRoom: boolean | null;
  floor: string | null;
  buildingId: string | null;
  balconyArea: number | null;
  area: number | null;
  approvalStatus: string | null;
  apartmentType: string | null;
  // The unit's own image when Salesforce provides one; otherwise the parent
  // project's image, so consumers always have something to render.
  image: string | null;
}
