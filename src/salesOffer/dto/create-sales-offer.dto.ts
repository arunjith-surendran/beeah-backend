import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSalesOfferDto {
  @IsString()
  name: string;

  @IsString()
  opportunityId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsNumber()
  sellingPrice: number;
}
