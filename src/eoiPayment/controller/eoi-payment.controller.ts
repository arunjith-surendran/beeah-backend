import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { GatewayOrderResultDto } from '../../paymentGateway/dto/gateway-order-result.dto';
import { EoiPaymentService } from '../service/eoi-payment.service';
import { CreateEoiPaymentOrderDto } from '../dto/create-eoi-payment-order.dto';
import { EoiPaymentOrderStatusResultDto } from '../dto/eoi-payment-order-status-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

@UseGuards(JwtAuthGuard)
@Controller('payments/ngenius-eoi')
export class EoiPaymentController {
  constructor(private readonly eoiPaymentService: EoiPaymentService) {}

  /**
   * Creates an N-Genius hosted-payment-page order for an EOI deposit.
   *
   * @param dto - Target EOI id, amount, and optional currency.
   * @returns The hosted payment page URL and order reference wrapped in a `{ message, data }` envelope.
   */
  @Post('orders')
  createOrder(
    @Body() dto: CreateEoiPaymentOrderDto,
  ): Promise<ResultWithMessage<GatewayOrderResultDto>> {
    return this.eoiPaymentService.createOrder(dto);
  }

  /**
   * Fetches an N-Genius order's current status - poll this after the app's
   * WebView detects the redirect back from the hosted payment page. On first
   * confirmed success, this also records the deposit against the order's EOI.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param orderReference - N-Genius order reference returned by `POST orders`.
   * @returns The order's state and a simplified success flag wrapped in a `{ message, data }` envelope.
   */
  @Get('orders/:orderReference')
  getOrderStatus(
    @CurrentUser() user: User,
    @Param('orderReference') orderReference: string,
  ): Promise<ResultWithMessage<EoiPaymentOrderStatusResultDto>> {
    return this.eoiPaymentService.getOrderStatus(user, orderReference);
  }
}
