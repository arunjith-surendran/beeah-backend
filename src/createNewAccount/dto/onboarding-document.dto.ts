import { IsString } from 'class-validator';

// Documents are uploaded individually beforehand via POST
// /create-new-account/upload-document (see UploadOnboardingDocumentDto), which
// returns a documentId - the final submission only references that id, it doesn't
// carry the file content again.
export class OnboardingDocumentDto {
  @IsString()
  documentId: string;
}
