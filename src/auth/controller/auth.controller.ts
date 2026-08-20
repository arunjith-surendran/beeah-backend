import {
  Controller,
  Post,
  Put,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user, issues auth tokens, and warms the Salesforce session.
   *
   * @param dto - New user's registration details.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Authenticates a user by email/password and issues auth tokens.dasdsadad
   *
   * @param dto - Login credentials.
   * @throws {UnauthorizedException} When the email or password is invalid.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Checks whether a user with the given email is already registered.
   *
   * @param email - Email address to look up.
   * @returns Whether a matching user exists.
   */
  @Get('check-user')
  checkUserExists(@Query('email') email: string) {
    return this.authService.checkUserExists(email);
  }

  /**
   * Sends a one-time password reset code to the given email, for the
   * forgot-password flow. The client is expected to have already confirmed
   * the account exists via `GET /auth/check-user`.
   *
   * @param dto - Email to send the OTP to.
   * @throws {NotFoundException} When no account matches the email.
   */
  @HttpCode(HttpStatus.OK)
  @Post('sendOtp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendPasswordResetOtp(dto.email);
  }

  /**
   * Verifies a password-reset OTP previously issued by `sendOtp`.
   *
   * @param dto - Email and the OTP the user submitted.
   * @throws {NotFoundException} When no OTP was requested for this email.
   * @throws {BadRequestException} When the OTP is expired, exhausted, or doesn't match.
   */
  @HttpCode(HttpStatus.OK)
  @Post('verifyOtp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyPasswordResetOtp(dto.email, dto.otp);
  }

  /**
   * Sets a new password for an email with a verified OTP on file - the final
   * step of the forgot-password flow.
   *
   * @param dto - Email and new password.
   * @throws {NotFoundException} When no account matches the email.
   * @throws {BadRequestException} When there's no verified, unexpired OTP for this email.
   */
  @Put('updatePassword')
  updatePassword(@Body() dto: UpdatePasswordDto) {
    return this.authService.resetPassword(dto.email, dto.password);
  }

  /**
   * Issues a new access/refresh token pair from a valid refresh token.
   *
   * @param user - Authenticated user attached by `JwtRefreshGuard`, including the raw refresh token.
   * @throws {UnauthorizedException} When the refresh token doesn't match the stored hash.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refresh(@CurrentUser() user: User & { rawRefreshToken: string }) {
    return this.authService.refreshTokens(user);
  }

  /**
   * Logs the current user out by clearing their stored refresh token.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @returns Nothing; resolves once the refresh token has been cleared.
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
