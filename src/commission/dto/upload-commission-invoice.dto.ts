import { IsString } from 'class-validator';

export class UploadCommissionInvoiceDto {
  @IsString()
  fileName: string;

  @IsString()
  base64: string;

  @IsString()
  recordId: string;
}

export class UploadCommissionInvoiceResultDto {
  documentId: string;
  azureUrl: string;
}
