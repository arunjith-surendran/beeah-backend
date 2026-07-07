import { Injectable } from '@nestjs/common';
import { SalesBookingService as SalesforceSalesBookingService } from '../../salesforce/modules/salesBooking/sales-booking.service';
import { GetAllSalesBookingApexResponse } from '../../salesforce/modules/salesBooking/types/get-sales-booking.type';

@Injectable()
export class SalesBookingRepository {
  constructor(
    private readonly salesforceSalesBookingService: SalesforceSalesBookingService,
  ) {}

  /**
   * Passes through to the Salesforce `allsalesbooking` Apex REST endpoint.
   *
   * @param userId - Salesforce user id to fetch sales bookings for.
   * @returns The raw Apex REST response.
   */
  getAllSalesBookings(userId: string): Promise<GetAllSalesBookingApexResponse> {
    return this.salesforceSalesBookingService.getAllSalesBookings(userId);
  }
}
