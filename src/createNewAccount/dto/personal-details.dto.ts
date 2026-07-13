import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { AgencySubType } from './agency-sub-type.enum';

export class PersonalDetailsDto {
  @IsString()
  type: string;

  @IsEnum(AgencySubType)
  subType: AgencySubType;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  nationality: string;

  @IsString()
  passportNumber: string;

  @IsString()
  passportExpiry: string;

  @IsString()
  emiratesId: string;

  @IsString()
  eidExpiry: string;

  @IsString()
  countryCode: string;

  @IsPhoneNumber()
  mobile: string;

  @IsEmail()
  email: string;

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
  srerdNumber?: string;

  @IsOptional()
  @IsString()
  brokerCardDetails?: string;

  @IsOptional()
  @IsString()
  srerdExpiry?: string;
}
