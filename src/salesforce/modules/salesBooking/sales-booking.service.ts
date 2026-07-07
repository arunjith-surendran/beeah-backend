import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { ALL_SALES_BOOKING_APEX_REST_PATH } from '../../network/paths/sales-booking.paths';
import {
  GetAllSalesBookingApexPayload,
  GetAllSalesBookingApexResponse,
} from './types/get-sales-booking.type';

@Injectable()
export class SalesBookingService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `allsalesbooking` Apex REST endpoint (POST) for a given owner.
   *
   * @param userId - Salesforce user id to fetch sales bookings for.
   * @returns The raw Apex REST response containing the user's sales booking records.
   */
  async getAllSalesBookings(
    userId: string,
  ): Promise<GetAllSalesBookingApexResponse> {
    const payload: GetAllSalesBookingApexPayload = { userId };
    const response =
      await this.salesforceClient.http.post<GetAllSalesBookingApexResponse>(
        ALL_SALES_BOOKING_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
