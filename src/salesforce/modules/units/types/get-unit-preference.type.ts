export interface GetUnitPreferenceApexPayload {
  projectId: string;
}

export interface GetUnitPreferenceApexResponse {
  tokenAmount: number;
  status: string;
  message: string;
  data: string[];
}
