import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LicensePartnerDto {
  @IsString()
  name: string;

  @IsString()
  nationality: string;

  @IsOptional()
  @IsString()
  emiratesId?: string;

  @IsString()
  passportNo: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsNumber()
  sharePercentage?: number;
}
