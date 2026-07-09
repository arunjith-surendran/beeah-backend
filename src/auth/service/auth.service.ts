import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from '../../users/service/users.service';
import { sanitizeUser } from '../../users/user.util';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload } from '../types/jwt-payload.type';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Creates a new user, hashing their password before storage.
   *
   * @param dto - New user's registration details.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });

    // Salesforce session is warmed (and cached inside SalesforceClient) as a side effect
    // so the first real Salesforce-backed call after signup doesn't pay for the handshake -
    // its token is intentionally not returned to the client.
    const [tokens] = await Promise.all([
      this.issueTokens(user),
      this.authRepository.warmSalesforceSession(),
    ]);
    return { user: sanitizeUser(user), ...tokens };
  }

  /**
   * Verifies a user's email/password and issues our own auth tokens.
   *
   * @param dto - Login credentials.
   * @throws {UnauthorizedException} When no user matches the email, or the password is wrong.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    // Kept as a manual guard (not the shared `unauthorizedException` helper) so TS narrows
    // `user` and `user.password` to non-null below, instead of needing a `user!.password!`.
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    unauthorizedException(passwordMatches, 'Invalid credentials');

    // Salesforce session is warmed (and cached inside SalesforceClient) as a side effect
    // so the first real Salesforce-backed call after login doesn't pay for the handshake -
    // its token is intentionally not returned to the client.
    const [tokens] = await Promise.all([
      this.issueTokens(user),
      this.authRepository.warmSalesforceSession(),
    ]);
    return { user: sanitizeUser(user), ...tokens };
  }

  /**
   * Checks whether a user with the given email is already registered.
   *
   * @param email - Email address to look up.
   * @throws {BadRequestException} When `email` is missing or blank.
   * @returns Whether a matching user exists.
   */
  async checkUserExists(email: string): Promise<{ exists: boolean }> {
    required(email, 'email');
    const user = await this.usersService.findByEmail(email);
    return { exists: !!user };
  }

  /**
   * Issues a new access/refresh token pair after validating the presented refresh token.
   *
   * @param user - User record augmented with the raw (unhashed) refresh token from the request.
   * @throws {UnauthorizedException} When the raw token doesn't match the stored hash.
   * @returns The sanitized user record plus a fresh access/refresh token pair.
   */
  async refreshTokens(user: User & { rawRefreshToken: string }) {
    const matches = await bcrypt.compare(
      user.rawRefreshToken,
      user.refreshToken ?? '',
    );
    unauthorizedException(matches, 'Invalid refresh token');

    const tokens = await this.issueTokens(user);
    return { user: sanitizeUser(user), ...tokens };
  }

  /**
   * Logs a user out by clearing their stored refresh token, invalidating future refreshes.
   *
   * @param userId - Id of the user to log out.
   */
  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  /**
   * Signs a fresh access/refresh token pair for a user and persists the hashed refresh token.
   *
   * @param user - User to issue tokens for.
   * @returns The signed `accessToken` and `refreshToken`.
   */
  private async issueTokens(user: User) {
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '15m'),
      } as JwtSignOptions),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      } as JwtSignOptions),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
