import { IsOptional, IsString } from 'class-validator';

export class BankDetailsDto {
  @IsString()
  bankName: string;

  @IsString()
  bankAccountName: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  beneficiaryName: string;

  @IsString()
  ibanNumber: string;

  @IsString()
  swiftCode: string;

  @IsString()
  currencyValue: string;

  @IsOptional()
  @IsString()
  bankBranchName?: string;

  @IsOptional()
  @IsString()
  bankAddress?: string;
}
