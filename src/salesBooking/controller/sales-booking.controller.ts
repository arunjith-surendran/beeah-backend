import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SalesBookingService } from '../service/sales-booking.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { SalesBookingDto } from '../dto/get-sales-booking.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales-bookings')
export class SalesBookingController {
  constructor(private readonly salesBookingService: SalesBookingService) {}

  /**
   * Fetches every sales booking owned by the Salesforce user our client-credentials grant
   * authenticates as, paginated on our side. Salesforce's `allsalesbooking` endpoint is a
   * POST; this route is GET, matching the read-oriented convention used by leads/EOI/dashboard.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's sales bookings, with pagination metadata alongside `message`.
   */
  @Get('get-all')
  getAllSalesBookings(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<SalesBookingDto[]>> {
    return this.salesBookingService.getAllSalesBookings(
      user,
      pageNumber,
      pageSize,
    );
  }
}
