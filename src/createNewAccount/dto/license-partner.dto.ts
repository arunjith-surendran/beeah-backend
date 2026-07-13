import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LicensePartnerDto {
  @IsString()
  name: string;

  @IsString()
  nationality: string;

  // NOTE: matches the client payload's field name exactly (client sends
  // "emiratedId", not "emiratesId").
  @IsOptional()
  @IsString()
  emiratedId?: string;

  @IsString()
  passportNo: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsNumber()
  sharePercentage?: number;
}
