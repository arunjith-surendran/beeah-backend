import { Controller, Get, Header } from '@nestjs/common';

/**
 * Public landing page for N-Genius's post-payment redirect. The app's WebView
 * intercepts navigation to this URL before it actually loads, so in normal
 * use this is never rendered - it only exists as a safe fallback in case the
 * payment page is ever opened outside the app's WebView.
 */
@Controller('payments/ngenius/callback')
export class PaymentCallbackController {
  @Get()
  @Header('Content-Type', 'text/html')
  callback(): string {
    return '<html><body><p>Payment completed. You can close this window and return to the app.</p></body></html>';
  }
}
