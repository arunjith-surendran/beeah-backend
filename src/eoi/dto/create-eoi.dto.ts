import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UnitPreferenceDto } from './unit-preference.dto';

export class CreateEoiDto {
  @IsString()
  projectId: string;

  @IsString()
  countryCode: string;

  @IsOptional()
  @IsString()
  countryOfResident?: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsString()
  mobilePhone: string;

  @IsOptional()
  @IsString()
  leadSource?: string;

  @IsString()
  recordTypeDeveloperName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UnitPreferenceDto)
  preferences: UnitPreferenceDto[];

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

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
