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
  // Required fields (present in JSON payload)
  @IsString()
  projectId: string;

  @IsString()
  buyerType: string;

  @IsString()
  firstName: string;

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

  @IsString()
  city: string;

  @IsBoolean()
  createdByPortalUser: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UnitPreferenceDto)
  unitPreferences: UnitPreferenceDto[];

  // Optional fields (present in JSON payload)
  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  leadSource?: string;

  @IsOptional()
  @IsString()
  recordTypeDeveloperName?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  passportExpiry?: string;

  @IsOptional()
  @IsString()
  eidNo?: string;

  @IsOptional()
  @IsString()
  emiratesExpiry?: string;

  @IsOptional()
  @IsString()
  firstApplicantAddress?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}
