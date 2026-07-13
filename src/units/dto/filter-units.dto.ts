import { IsNumberString, IsOptional } from 'class-validator';

export class FilterUnitsDto {
  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsNumberString()
  noOfBedrooms?: string;

  @IsOptional()
  @IsNumberString()
  minArea?: string;

  @IsOptional()
  @IsNumberString()
  maxArea?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  pageNumber?: string;

  @IsOptional()
  pageSize?: string;
}
