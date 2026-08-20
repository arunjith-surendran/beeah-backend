import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { buildOtpEmailHtml } from './templates/otp-email.template';

type SmtpTransporter = nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

// Drop a logo image here (any name, referenced below) - it's copied into
// dist/mail/assets alongside the compiled JS by nest-cli.json's `assets`
// config, so this path resolves the same way in dev and in the built app.
// Until a file exists here, emails just render a text "BEEAH" header instead
// of a broken image icon - nothing needs to change once you add one.
const LOGO_PATH = join(__dirname, 'assets', 'logo.png');
const LOGO_CID = 'beeah-logo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: SmtpTransporter | null = null;

  constructor(private readonly config: ConfigService) {}

  /**
   * Lazily builds the SMTP transporter on first send, rather than at app
   * bootstrap - so a server without SMTP configured yet still starts up
   * fine, and only fails (clearly) if something actually tries to send mail.
   */
  private getTransporter(): SmtpTransporter {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<string>('SMTP_PORT');
    const user = this.config.get<string>('SMTP_USER');
    const password = this.config.get<string>('SMTP_PASSWORD');

    if (!host || !port || !user || !password) {
      throw new InternalServerErrorException(
        'Email sending is not configured (missing SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD)',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: this.config.get<string>('SMTP_SECURE', 'false') === 'true',
      auth: { user, pass: password },
    });
    return this.transporter;
  }

  /**
   * Sends a one-time password reset code to the given email.
   *
   * @param to - Recipient email address.
   * @param otp - The plaintext OTP to include (never stored/logged - only hashed copies are persisted).
   * @param expiryMinutes - How long the OTP is valid for, echoed in the email copy.
   */
  async sendOtpEmail(
    to: string,
    otp: string,
    expiryMinutes: number,
  ): Promise<void> {
    const from =
      this.config.get<string>('SMTP_FROM') ??
      this.config.get<string>('SMTP_USER');
    const hasLogo = existsSync(LOGO_PATH);

    const info = await this.getTransporter().sendMail({
      from,
      to,
      subject: 'Your BEEAH password reset code',
      text: `Your one-time verification code is ${otp}. It expires in ${expiryMinutes} minutes. If you didn't request this, you can safely ignore this email.`,
      html: buildOtpEmailHtml({ otp, expiryMinutes, hasLogo }),
      attachments: hasLogo
        ? [{ filename: 'logo.png', path: LOGO_PATH, cid: LOGO_CID }]
        : undefined,
    });

    // Doesn't confirm inbox delivery (that's outside SMTP's visibility) - just
    // that the upstream server accepted the message and for whom. Useful for
    // telling "we never actually sent it" apart from "sent, but filtered
    // somewhere downstream (spam/quarantine)" when an OTP doesn't arrive.
    this.logger.log(
      `OTP email accepted by SMTP server: messageId=${info.messageId} accepted=${JSON.stringify(info.accepted)} rejected=${JSON.stringify(info.rejected)}`,
    );
  }
}
