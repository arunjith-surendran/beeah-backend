import { IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  unitId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
