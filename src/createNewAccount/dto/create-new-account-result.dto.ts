export class CreateNewAccountResultDto {
  onboardingId: string;
  bankId: string;
  // Echoes back the documentIds submitted in the request, so the client can confirm
  // which documents were attached to this submission without a separate lookup.
  documentIds: string[];
}
