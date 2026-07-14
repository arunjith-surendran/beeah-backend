import { Type } from 'class-transformer';
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

  // Client sends this as either a number or a numeric string - coerce so both work.
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sharePercentage?: number;
}
