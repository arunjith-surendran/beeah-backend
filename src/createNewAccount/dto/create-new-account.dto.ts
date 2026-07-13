import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { OnboardingDetailsDto } from './onboarding-details.dto';
import { PersonalDetailsDto } from './personal-details.dto';
import { BankDetailsDto } from './bank-details.dto';
import { LicensePartnerDto } from './license-partner.dto';
import { OnboardingDocumentDto } from './onboarding-document.dto';

/**
 * Company registrations send `onboarding`; individual (self-licensed) registrations
 * send `personalDetails` instead. Exactly one of the two must be present - enforced
 * in CreateNewAccountService, since the two shapes have no required fields in common.
 */
export class CreateNewAccountDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardingDetailsDto)
  onboarding?: OnboardingDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  personalDetails?: PersonalDetailsDto;

  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank: BankDetailsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicensePartnerDto)
  licensePartner?: LicensePartnerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingDocumentDto)
  documents: OnboardingDocumentDto[];
}
