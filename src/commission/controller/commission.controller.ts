import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CommissionService } from '../service/commission.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CommissionDto } from '../dto/get-commissions.dto';
import {
  UploadCommissionInvoiceDto,
  UploadCommissionInvoiceResultDto,
} from '../dto/upload-commission-invoice.dto';

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

  /**
   * Uploads a base64-encoded invoice against a commission record. Calls Salesforce's
   * shared `uploadDocument` Apex REST endpoint independently (not the generic
   * `/documents/upload` route), matching this module's self-contained design.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - File name, base64 content, and the commission record id to attach it to.
   * @returns The created document id and Azure URL wrapped in a `{ message, data }` envelope.
   */
  @Post('upload-invoice')
  uploadInvoice(
    @CurrentUser() user: User,
    @Body() dto: UploadCommissionInvoiceDto,
  ): Promise<ResultWithMessage<UploadCommissionInvoiceResultDto>> {
    return this.commissionService.uploadInvoice(user, dto);
  }
}
