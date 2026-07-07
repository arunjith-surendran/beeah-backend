import { IsOptional, IsString } from 'class-validator';

export class OnboardingDocumentDto {
  @IsString()
  documentType: string;

  @IsString()
  fileName: string;

  @IsString()
  base64Data: string;

  @IsOptional()
  @IsString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  expiryDate?: string;
}
