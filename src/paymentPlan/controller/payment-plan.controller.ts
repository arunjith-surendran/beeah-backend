import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PaymentPlanService } from '../service/payment-plan.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { PaymentPlanDto } from '../dto/get-payment-plan.dto';

@UseGuards(JwtAuthGuard)
@Controller('payment-plans')
export class PaymentPlanController {
  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  /**
   * Fetches the payment plan for the given Salesforce building. Salesforce's
   * `getpaymentplan` endpoint is a POST; this route is GET, matching the read-oriented
   * convention used by units/leads/EOI/sales-bookings.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param buildingId - Salesforce building id, taken from the route path.
   * @returns The building's payment plans wrapped in a `{ message, data }` envelope.
   */
  @Get('get-all/:buildingId')
  getPaymentPlan(
    @CurrentUser() user: User,
    @Param('buildingId') buildingId: string,
  ): Promise<ResultWithMessage<PaymentPlanDto[]>> {
    return this.paymentPlanService.getPaymentPlan(user, buildingId);
  }
}
