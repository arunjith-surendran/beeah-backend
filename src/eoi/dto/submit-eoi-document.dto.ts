import { IsString } from 'class-validator';

export class SubmitEoiDocumentDto {
  @IsString()
  fileName: string;

  @IsString()
  base64: string;

  @IsString()
  documentType: string;
}
