export class ProjectDocumentDto {
  id: string;
  type: string;
  name: string;
  url: string | null;
  secondaryUrl: string | null;
  ownerId: string;
  ownerName: string;
  createdDate: string;
}

export class ProjectDetailDto {
  id: string;
  code: string | null;
  name: string;
  nameArabic: string | null;
  propertyType: string[];
  propertyStatus: string | null;
  startingPrice: number | null;
  startingArea: number | null;
  reraNumber: string | null;
  reraName: string | null;
  postalCode: string | null;
  oneLiner: string | null;
  description: string | null;
  amenities: string[];
  documents: ProjectDocumentDto[];
  googleMapsLocation: string | null;
  entityName: string | null;
  createdDate: string;
  country: string | null;
  city: string | null;
  anticipatedHandoverDate: string | null;
  anticipatedCompletionDate: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  actualConstructionStartDate: string | null;
}
