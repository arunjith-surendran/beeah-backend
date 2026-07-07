import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { sanitizeUser } from '../user.util';

@Controller('users')
export class UsersController {
  /**
   * Returns the currently authenticated user's profile.
   *
   * @param user - The authenticated user, injected from the JWT access token.
   * @returns The user record with sensitive fields (password, refresh token) stripped.
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return sanitizeUser(user);
  }
}
