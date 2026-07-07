import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OnboardingDetailsDto } from './onboarding-details.dto';
import { BankDetailsDto } from './bank-details.dto';
import { OnboardingDocumentDto } from './onboarding-document.dto';

export class CreateNewAccountDto {
  @ValidateNested()
  @Type(() => OnboardingDetailsDto)
  onboarding: OnboardingDetailsDto;

  @ValidateNested()
  @Type(() => BankDetailsDto)
  bank: BankDetailsDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OnboardingDocumentDto)
  documents: OnboardingDocumentDto[];
}
