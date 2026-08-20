import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

const STRONG_PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export class UpdatePasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(STRONG_PASSWORD_PATTERN, {
    message:
      'password must be at least 8 characters and include a letter, a number, and a special character (@$!%*#?&)',
  })
  password: string;
}
