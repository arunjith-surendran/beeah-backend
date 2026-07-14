import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AgencySubType } from './agency-sub-type.enum';

export class CompanyInformationDto {
  @IsEnum(AgencySubType)
  subtype: AgencySubType;

  @IsString()
  type: string;

  @IsString()
  agencyName: string;

  @IsString()
  tradeLicenseNumber: string;

  @IsString()
  tradeLicenseExpiry: string;

  @IsEmail()
  email: string;

  // Full-number phone fields (unlike the local-number authorizedSignatoryMobile) -
  // not validated with @IsPhoneNumber since the client-supplied format isn't
  // confirmed yet, same reasoning as personalDetails.mobile.
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  poBox?: string;

  @IsOptional()
  @IsString()
  authorityRegisteredWith?: string;

  @IsOptional()
  @IsString()
  brokerLicenseNumber?: string;

  @IsOptional()
  @IsString()
  brokerLicenseExpiry?: string;

  @IsOptional()
  @IsString()
  haveTrn?: string;

  @IsOptional()
  @IsString()
  trnNumber?: string;

  @IsOptional()
  @IsString()
  ownerShipType?: string;
}
