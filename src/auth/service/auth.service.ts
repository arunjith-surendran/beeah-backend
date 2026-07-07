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
import { unauthorizedException } from '../../common/utils/validators.util';

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
   * @returns The sanitized user record, a fresh access/refresh token pair, and the
   * Salesforce access token (`undefined` if Salesforce authentication failed).
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

    const [tokens, salesforceAccessToken] = await Promise.all([
      this.issueTokens(user),
      this.authRepository.warmSalesforceSession(),
    ]);
    return { user: sanitizeUser(user), ...tokens, salesforceAccessToken };
  }

  /**
   * Verifies a user's email/password, issues our own auth tokens, and authenticates against Salesforce.
   *
   * @param dto - Login credentials.
   * @throws {UnauthorizedException} When no user matches the email, or the password is wrong.
   * @returns The sanitized user record, a fresh access/refresh token pair, and the
   * Salesforce access token (`undefined` if Salesforce authentication failed).
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

    const [tokens, salesforceAccessToken] = await Promise.all([
      this.issueTokens(user),
      this.authRepository.warmSalesforceSession(),
    ]);
    return { user: sanitizeUser(user), ...tokens, salesforceAccessToken };
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
