import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCommissionDto {
  @IsOptional()
  @IsString()
  name?: string;

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
