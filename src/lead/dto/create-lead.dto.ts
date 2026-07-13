import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeadDto {
  // No dedicated Salesforce "get project by id" validation happens here - if the caller
  // doesn't have an interested project selected, this is simply omitted (matches the
  // real Salesforce broker portal's lead-creation form, where Interested Project isn't required).
  @IsOptional()
  @IsString()
  projectId?: string;

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

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  mobilePhone: string;

  @IsString()
  @IsNotEmpty()
  recordTypeDeveloperName: string;

  @IsBoolean()
  createdByPortalUser: boolean;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  interestedPropertyType?: string;

  @IsOptional()
  @IsString()
  noOfBedroom?: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @IsOptional()
  @IsString()
  budgetRange?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateLeadResponseDto {
  leadId: string;
}
