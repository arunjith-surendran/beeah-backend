import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ModeOfPaymentDto {
  @IsString()
  paymentMode: string;

  @IsString()
  currencyType: string;

  @IsNumber()
  depositAmount: number;

  @IsOptional()
  @IsString()
  bankName?: string | null;

  @IsOptional()
  @IsString()
  transactionDate?: string | null;

  @IsOptional()
  @IsString()
  transactionNo?: string | null;

  @IsOptional()
  @IsString()
  chequeNumber?: string | null;

  @IsOptional()
  @IsString()
  chequeDate?: string | null;

  @IsString()
  thirdPartyCheque: string;
}
