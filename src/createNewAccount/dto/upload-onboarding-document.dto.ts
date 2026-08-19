import { IsNotEmpty, IsString } from 'class-validator';

// Uploads a single onboarding document ahead of the final create-new-account
// submission - no Salesforce record exists yet for it to attach to, so this
// returns a documentId to reference in that submission's `documents` array.
export class UploadOnboardingDocumentDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  base64: string;

  // The dynamic documentType value from a GET /required-documents entry, not a
  // hardcoded set of document types.
  @IsString()
  @IsNotEmpty()
  documentType: string;
}
