import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UnitPreferenceDto } from './unit-preference.dto';

export class CreateEoiDto {
  @IsString()
  bookingType: string;

  @IsString()
  projectId: string;

  @IsString()
  buyerType: string;

  @IsString()
  propertyType: string;

  @IsBoolean()
  createdByPortalUser: boolean;

  @IsOptional()
  @IsString()
  leadId?: string;

  @IsString()
  salutation: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  countryCode: string;

  @IsNumber()
  mobileNo: number;

  @IsString()
  countryOfResidence: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  firstApplicantAddress?: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  leadSource?: string;

  @IsOptional()
  @IsString()
  recordTypeDeveloperName?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  companyRegistrationPlace?: string;

  @IsOptional()
  @IsString()
  companyRegistrationDate?: string;

  @IsOptional()
  @IsString()
  tradeLicenseNo?: string;

  @IsOptional()
  @IsString()
  tradeLicenseExpiryDate?: string;

  @IsOptional()
  @IsString()
  tradeLicenseIssueDate?: string;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  corpAddress?: string;

  @IsOptional()
  @IsString()
  corpCountry?: string;

  @IsOptional()
  @IsString()
  corpCity?: string;

  @IsOptional()
  @IsString()
  corpPostalCode?: string;

  @IsOptional()
  @IsString()
  representativeSalutation?: string;

  @IsOptional()
  @IsString()
  representativeFirstName?: string;

  @IsOptional()
  @IsString()
  representativeLastName?: string;

  @IsOptional()
  @IsEmail()
  representativeEmail?: string;

  @IsOptional()
  @IsString()
  representativeCountryCode?: string;

  @IsOptional()
  @IsNumber()
  representativeMobileNo?: number;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  passportExpiry?: string;

  // Emirates ID for UAE residents, passport number for non-UAE residents -
  // one field serves both, matching the frontend's National_ID_Number field.
  @IsOptional()
  @IsString()
  eidNo?: string;

  @IsOptional()
  @IsString()
  emiratesExpiry?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  vatCertificateNo?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UnitPreferenceDto)
  unitPreferences: UnitPreferenceDto[];
}
