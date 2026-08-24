import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CommissionService } from '../service/commission.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { CommissionDto } from '../dto/get-commissions.dto';

@UseGuards(JwtAuthGuard)
@Controller('commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  /**
   * Fetches every commission owned by the Salesforce user our client-credentials grant
   * authenticates as, paginated on our side. Commissions are nested under sales bookings
   * in Salesforce (there's no dedicated commission endpoint), so this reuses the same
   * `allsalesbooking` Apex REST call as `/sales-bookings/get-all` and flattens the result.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @param search - Case-insensitive substring match against unit name, project, and status.
   * @param project - Exact (case-insensitive) project-name filter.
   * @param dateSelected - Raw value from the frontend's date-created dropdown: either a
   * number of days back from today (e.g. `'7'`), a `'startDate,endDate'` (`YYYY-MM-DD`)
   * custom range, or empty/`'0'` for no filter. Matches `doesDateMatchFilter`'s encoding
   * on the frontend, moved server-side.
   * @returns The requested page of the user's commissions, with pagination metadata alongside `message`.
   */
  @Get('get-all')
  getAllCommissions(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
    @Query('project') project?: string,
    @Query('dateSelected') dateSelected?: string,
  ): Promise<PaginatedResultWithMessage<CommissionDto[]>> {
    return this.commissionService.getAllCommissions(
      user,
      pageNumber,
      pageSize,
      {
        search,
        project,
        dateSelected,
      },
    );
  }
}
