import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMode } from './payment-mode.enum';

export class ModeOfPaymentDto {
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;

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
