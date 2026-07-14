import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CompanyInformationDto } from './company-information.dto';
import { SignatoryDetailsDto } from './signatory-details.dto';
import { PersonalDetailsDto } from './personal-details.dto';
import { BankDetailsDto } from './bank-details.dto';
import { LicensePartnerDto } from './license-partner.dto';
import { ManagerDto } from './manager.dto';
import { EmployeeDto } from './employee.dto';
import { OnboardingDocumentDto } from './onboarding-document.dto';

/**
 * Company registrations send `companyInformation` + `signatoryDetails` (plus
 * optionally `managers`/`employees`); individual (self-licensed) registrations
 * send `personalDetails` instead. Exactly one of the two shapes must be present -
 * enforced in CreateNewAccountService, since they have no required fields in common.
 */
export class CreateNewAccountDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyInformationDto)
  companyInformation?: CompanyInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SignatoryDetailsDto)
  signatoryDetails?: SignatoryDetailsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalDetailsDto)
  personalDetails?: PersonalDetailsDto;

  @ValidateNested()
  @Type(() => BankDetailsDto)
  bankInfo: BankDetailsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicensePartnerDto)
  licensePartners?: LicensePartnerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManagerDto)
  managers?: ManagerDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmployeeDto)
  employees?: EmployeeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OnboardingDocumentDto)
  documents: OnboardingDocumentDto[];
}
