import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GatewayOrderResultDto } from '../../paymentGateway/dto/gateway-order-result.dto';
import { SalesBookingPaymentService } from '../service/sales-booking-payment.service';
import { CreateSalesBookingPaymentOrderDto } from '../dto/create-sales-booking-payment-order.dto';
import { SalesBookingPaymentOrderStatusResultDto } from '../dto/sales-booking-payment-order-status-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

// Own prefix (distinct from EOI's `payments/ngenius/orders`) so the two
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
   * @param dto - Target booking id, amount, and optional currency.
   * @returns The hosted payment page URL and order reference wrapped in a `{ message, data }` envelope.
   */
  @Post('orders')
  createOrder(
    @Body() dto: CreateSalesBookingPaymentOrderDto,
  ): Promise<ResultWithMessage<GatewayOrderResultDto>> {
    return this.salesBookingPaymentService.createOrder(dto);
  }

  /**
   * Fetches an N-Genius order's current status - poll this after the app's
   * WebView detects the redirect back from the hosted payment page.
   *
   * @param orderReference - N-Genius order reference returned by `POST orders`.
   * @returns The order's state and a simplified success flag wrapped in a `{ message, data }` envelope.
   */
  @Get('orders/:orderReference')
  getOrderStatus(
    @Param('orderReference') orderReference: string,
  ): Promise<ResultWithMessage<SalesBookingPaymentOrderStatusResultDto>> {
    return this.salesBookingPaymentService.getOrderStatus(orderReference);
  }
}
