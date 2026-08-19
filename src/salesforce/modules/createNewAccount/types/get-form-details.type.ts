export interface GetFormDetailsApexPayload {
  mode: string;
  metadataType: string;
  subType: string;
}

export interface FormFieldPicklistOption {
  value: string;
  label: string;
}

export interface FormFieldConfigRecord {
  validationType: string;
  targetObject: string;
  subType: string;
  sortOrder: number;
  relatedStartDateField: string | null;
  relatedEndDateField: string | null;
  picklistOptions: FormFieldPicklistOption[];
  mode: string;
  isVisible: boolean;
  isRequired: boolean;
  isPicklist: boolean;
  isMultiPicklist: boolean;
  isEditable: boolean;
  gridSize: string;
  fieldLabel: string;
  fieldDataType: string;
  fieldApiName: string;
  developerName: string;
}

/**
 * Keyed by section name (e.g. "Bank Info", "Agent Details") as returned by the
 * Apex REST endpoint - the set of sections is config-driven on the Salesforce side
 * and varies per `subType`, so it isn't modeled as fixed fields here.
 */
export type GetFormDetailsApexResponse = Record<
  string,
  FormFieldConfigRecord[]
>;
