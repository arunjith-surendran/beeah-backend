import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateEoiPaymentOrderDto {
  @IsString()
  eoiId: string;

  // Major currency units (e.g. 100.50 AED), converted to minor units for N-Genius.
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
