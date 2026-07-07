import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  countryOfResident: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @IsString()
  @IsNotEmpty()
  leadSource: string;

  @IsString()
  @IsNotEmpty()
  recordTypeDeveloperName: string;

  @IsBoolean()
  createdByPortalUser: boolean;
}

export class CreateLeadResponseDto {
  leadId: string;
}
