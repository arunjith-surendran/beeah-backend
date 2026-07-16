import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SalesBookingPaymentService } from '../service/sales-booking-payment.service';
import { CreateSalesBookingPaymentOrderDto } from '../dto/create-sales-booking-payment-order.dto';
import { SalesBookingPaymentOrderResultDto } from '../dto/sales-booking-payment-order-result.dto';
import { SalesBookingPaymentOrderStatusResultDto } from '../dto/sales-booking-payment-order-status-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

// Own prefix (distinct from EOI's `payments/ngenius-eoi/orders`) so the two
// payment features can't collide on the same route.
@UseGuards(JwtAuthGuard)
@Controller('payments/ngenius/sales-bookings')
export class SalesBookingPaymentController {
  constructor(
    private readonly salesBookingPaymentService: SalesBookingPaymentService,
  ) {}

  /**
   * Creates an N-Genius hosted-payment-page order for a sales booking's token amount.
   *
   * @param dto - Amount, idempotency key, and optional currency.
   * @returns The full N-Genius order-creation response and stored payment row, wrapped in a `{ message, data }` envelope.
   */
  @Post('orders')
  createOrder(
    @Body() dto: CreateSalesBookingPaymentOrderDto,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderResultDto>> {
    return this.salesBookingPaymentService.createOrder(dto);
  }

  /**
   * Fetches an N-Genius order's current status - poll this after the app's
   * WebView detects the redirect back from the hosted payment page.
   *
   * @param orderReference - N-Genius order reference returned by `POST orders`.
   * @returns The full N-Genius status response and stored payment row, wrapped in a `{ message, data }` envelope.
   */
  @Get('orders/:orderReference')
  getOrderStatus(
    @Param('orderReference') orderReference: string,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderStatusResultDto>> {
    return this.salesBookingPaymentService.getOrderStatus(orderReference);
  }
}
