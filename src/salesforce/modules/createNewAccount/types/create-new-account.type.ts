// The `brokeronboarding` Apex REST endpoint is fully config-driven on the
// Salesforce side (same "Broker Field Config" custom metadata that drives
// GET /form-details) and accepts Salesforce fieldApiNames directly, so the
// payload shape here is intentionally untyped - describing a fixed field list
// would just be a stale copy of whatever Salesforce's metadata currently says.
export type CreateNewAccountPayload = Record<string, unknown>;

export interface CreateNewAccountApexResponse {
  success: boolean;
  onboardingId: string;
  message: string;
  bankId: string;
}
