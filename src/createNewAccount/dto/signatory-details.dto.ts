import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignatoryDetailsDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Demonym (e.g. "Afghan"), not the country name - matches
  // PersonalDetailsDto.nationality, which maps to the same restricted
  // Salesforce picklist.
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

  // "Country: dialCode" (e.g. "Afghanistan: 93") - matches
  // PersonalDetailsDto.countryCode's restricted-picklist format.
  @IsString()
  authorizedSignatoryCountryCode: string;

  // Local number, dial code carried separately above - matches
  // PersonalDetailsDto.mobile.
  @IsString()
  @IsNotEmpty()
  authorizedSignatoryMobile: string;

  @IsEmail()
  authorizedSignatoryEmail: string;

  @IsString()
  role: string;

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
