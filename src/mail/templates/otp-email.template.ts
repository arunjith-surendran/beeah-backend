export interface OtpEmailTemplateOptions {
  otp: string;
  expiryMinutes: number;
  // Whether a logo image is attached (as a cid embed) for this send - false
  // renders a text-only header instead of a broken image icon.
  hasLogo: boolean;
}

// Table-based layout with inline styles throughout, deliberately - email
// clients (Outlook especially) strip <style> blocks and modern CSS, so this
// is the only markup style that reliably renders the same everywhere.
export function buildOtpEmailHtml({
  otp,
  expiryMinutes,
  hasLogo,
}: OtpEmailTemplateOptions): string {
  const year = new Date().getFullYear();
  const otpDigits = otp
    .split('')
    .map(
      (digit) =>
        `<td style="width:44px;height:52px;background-color:#F0F6FC;border:1px solid #DCE6F0;border-radius:8px;text-align:center;vertical-align:middle;font-size:26px;font-weight:700;color:#0078C8;font-family:Helvetica,Arial,sans-serif;">${digit}</td>`,
    )
    .join('<td style="width:8px;"></td>');

  const logoCell = hasLogo
    ? `<img src="cid:beeah-logo" alt="BEEAH" width="120" style="display:block;margin:0 auto;border:0;" />`
    : `<span style="font-size:22px;font-weight:700;letter-spacing:1px;color:#101820;font-family:Helvetica,Arial,sans-serif;">BEEAH</span>`;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your BEEAH password reset code</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#F1F3F5;padding:28px 32px;text-align:center;border-bottom:1px solid #E2E5E9;">
                ${logoCell}
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px 8px;text-align:center;">
                <h1 style="margin:0;font-size:20px;line-height:28px;color:#101820;font-family:Helvetica,Arial,sans-serif;">Verify your identity</h1>
                <p style="margin:12px 0 0;font-size:14px;line-height:22px;color:#5B6472;font-family:Helvetica,Arial,sans-serif;">
                  Use the code below to reset your BEEAH account password. This code expires in ${expiryMinutes} minutes.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>${otpDigits}</tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 40px 32px;text-align:center;">
                <p style="margin:0;font-size:13px;line-height:20px;color:#9AA5B1;font-family:Helvetica,Arial,sans-serif;">
                  If you didn't request this code, you can safely ignore this email - your password won't be changed.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background-color:#F7F8FA;padding:20px 32px;text-align:center;border-top:1px solid #ECEEF1;">
                <p style="margin:0;font-size:12px;color:#9AA5B1;font-family:Helvetica,Arial,sans-serif;">&copy; ${year} BEEAH. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
