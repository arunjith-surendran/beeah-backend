import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { DashboardService } from '../service/dashboard.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { DashboardDto } from '../dto/get-dashboard.dto';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Fetches lead/EOI/booking status counts for the Salesforce user our client-credentials
   * grant authenticates as.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param timeLineInDays - Optional time-line window in days to scope the counts to.
   * @returns The dashboard counts wrapped in a `{ message, data }` envelope.
   */
  @Get('summary')
  getDashboardInformation(
    @CurrentUser() user: User,
    @Query('timeLineInDays') timeLineInDays?: string,
  ): Promise<ResultWithMessage<DashboardDto>> {
    return this.dashboardService.getDashboardInformation(user, timeLineInDays);
  }
}
