import { Injectable, Logger } from '@nestjs/common';
import { PasswordResetOtp } from '@prisma/client';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(
    private readonly salesforceClient: SalesforceClient,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Authenticates against Salesforce and returns the access token so it can be surfaced to the client.
   * Failures are logged and swallowed since this is best-effort, not a login requirement -
   * callers get `undefined` back instead of the request failing.
   *
   * @returns The Salesforce access token, or `undefined` if authentication failed.
   */
  async warmSalesforceSession(): Promise<string | undefined> {
    try {
      const session = await this.salesforceClient.authenticate();
      return session.accessToken;
    } catch (error) {
      this.logger.warn(
        `Salesforce session warm-up failed: ${(error as Error).message}`,
      );
      return undefined;
    }
  }

  /**
   * Creates or replaces the single active password-reset OTP for an email -
   * a fresh `sendOtp` call always invalidates whatever code was issued before.
   *
   * @param email - Email the OTP was issued for.
   * @param otpHash - Bcrypt hash of the plaintext OTP.
   * @param expiresAt - When this OTP stops being valid.
   * @returns The upserted OTP record.
   */
  saveOtp(
    email: string,
    otpHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetOtp> {
    return this.prisma.passwordResetOtp.upsert({
      where: { email },
      create: { email, otpHash, expiresAt },
      update: { otpHash, expiresAt, attempts: 0, verified: false },
    });
  }

  /**
   * Passes through to Prisma to find the active OTP record for an email.
   *
   * @param email - Email to look up.
   * @returns The matching OTP record, or `null` if none exists.
   */
  findOtp(email: string): Promise<PasswordResetOtp | null> {
    return this.prisma.passwordResetOtp.findUnique({ where: { email } });
  }

  /**
   * Marks an email's OTP record as verified, so a subsequent `updatePassword`
   * call knows the code was actually confirmed.
   *
   * @param email - Email whose OTP record to mark verified.
   */
  async markOtpVerified(email: string): Promise<void> {
    await this.prisma.passwordResetOtp.update({
      where: { email },
      data: { verified: true },
    });
  }

  /**
   * Increments the failed-attempt counter on an email's OTP record.
   *
   * @param email - Email whose OTP record to update.
   */
  async incrementOtpAttempts(email: string): Promise<void> {
    await this.prisma.passwordResetOtp.update({
      where: { email },
      data: { attempts: { increment: 1 } },
    });
  }

  /**
   * Deletes an email's OTP record - once verified and consumed by a password
   * reset (or expired/exhausted), it must not be reusable.
   *
   * @param email - Email whose OTP record to delete.
   */
  async deleteOtp(email: string): Promise<void> {
    await this.prisma.passwordResetOtp.deleteMany({ where: { email } });
  }
}
