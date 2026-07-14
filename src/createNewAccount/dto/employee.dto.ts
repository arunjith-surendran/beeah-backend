import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  employeeId?: string;
}
