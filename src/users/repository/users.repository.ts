import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Passes through to Prisma to find a user by email.
   *
   * @param email - Email address to look up.
   * @returns The matching user, or `null` if none exists.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  /**
   * Passes through to Prisma to find a user by phone.
   *
   * @param phone - Phone number to look up.
   * @returns The matching user, or `null` if none exists.
   */
  findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  /**
   * Passes through to Prisma to find a user by id.
   *
   * @param id - User id to look up.
   * @returns The matching user, or `null` if none exists.
   */
  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Passes through to Prisma to create a user.
   *
   * @param data - New user's details, with the password already hashed.
   * @returns The created user.
   */
  create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Passes through to Prisma to update a user's stored refresh token.
   *
   * @param userId - Id of the user to update.
   * @param refreshToken - New hashed refresh token, or `null` to clear it on logout.
   * @returns The updated user.
   */
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
