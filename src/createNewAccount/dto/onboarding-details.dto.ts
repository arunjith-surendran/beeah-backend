import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AgencySubType } from './agency-sub-type.enum';

export class OnboardingDetailsDto {
  @IsEnum(AgencySubType)
  subType: AgencySubType;

  @IsString()
  agencyName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  type: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  poBox?: string;

  @IsOptional()
  @IsString()
  ownerShipType?: string;

  @IsOptional()
  @IsString()
  companyReraRegistrationNumber?: string;

  @IsOptional()
  @IsString()
  companyReraExpiry?: string;

  @IsOptional()
  @IsString()
  authorizedWith?: string;

  @IsOptional()
  @IsString()
  haveTrn?: string;

  @IsOptional()
  @IsEmail()
  authorizedSignatoryEmail?: string;

  @IsOptional()
  @IsString()
  authorizedSignatoryMobile?: string;

  @IsOptional()
  @IsString()
  authorizedSignatoryCountryCode?: string;

  @IsOptional()
  @IsString()
  addressLine1?: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  tradeLicenseNumber?: string;

  @IsOptional()
  @IsString()
  tradeLicenseExpiry?: string;
}
