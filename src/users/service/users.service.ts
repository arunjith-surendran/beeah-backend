import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from '../repository/users.repository';
import { conflictException } from '../../common/utils/validators.util';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /**
   * Finds a user by email.
   *
   * @param email - Email address to look up.
   * @returns The matching user, or `null` if none exists.
   */
  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * Finds a user by id.
   *
   * @param id - User id to look up.
   * @returns The matching user, or `null` if none exists.
   */
  findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  /**
   * Creates a new user after verifying the email and phone are not already taken.
   *
   * @param data - New user's details, with the password already hashed.
   * @throws {ConflictException} When the email or phone is already registered.
   * @returns The created user.
   */
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<User> {
    const existingEmail = await this.usersRepository.findByEmail(data.email);
    conflictException(!!existingEmail, 'Email is already registered');

    const existingPhone = await this.usersRepository.findByPhone(data.phone);
    conflictException(!!existingPhone, 'Phone number is already registered');

    return this.usersRepository.create(data);
  }

  /**
   * Updates a user's stored (hashed) refresh token.
   *
   * @param userId - Id of the user to update.
   * @param refreshToken - New hashed refresh token, or `null` to clear it on logout.
   * @returns The updated user.
   */
  updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    return this.usersRepository.updateRefreshToken(userId, refreshToken);
  }
}
