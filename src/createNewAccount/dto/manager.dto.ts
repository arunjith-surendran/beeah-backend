import { IsOptional, IsString } from 'class-validator';

export class ManagerDto {
  @IsString()
  name: string;

  // Demonym (e.g. "Afghan") - matches LicensePartnerDto.nationality.
  @IsString()
  nationality: string;

  @IsString()
  passportNo: string;

  @IsOptional()
  @IsString()
  emiratesId?: string;
}
