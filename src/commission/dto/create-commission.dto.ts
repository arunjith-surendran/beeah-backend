import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommissionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  bookingId?: string;
}
