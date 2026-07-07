import { IsString } from 'class-validator';

export class BankDetailsDto {
  @IsString()
  bankName: string;

  @IsString()
  bankAccountName: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  ibanNumber: string;

  @IsString()
  swiftCode: string;

  @IsString()
  currencyValue: string;
}
