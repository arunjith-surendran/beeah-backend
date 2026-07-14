import { IsString } from 'class-validator';

export class UploadOnboardingDocumentDto {
  @IsString()
  fileName: string;

  @IsString()
  base64: string;

  @IsString()
  documentType: string;
}
