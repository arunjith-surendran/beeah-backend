import { IsString } from 'class-validator';

export class UploadDocumentDto {
  @IsString()
  fileName: string;

  @IsString()
  base64: string;

  @IsString()
  recordId: string;

  @IsString()
  documentType: string;
}
