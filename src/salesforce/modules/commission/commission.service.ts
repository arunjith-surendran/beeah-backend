import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { ALL_SALES_BOOKING_APEX_REST_PATH } from '../../network/paths/sales-booking.paths';
import {
  GetAllCommissionBookingsApexPayload,
  GetAllCommissionBookingsApexResponse,
} from './types/get-commission-bookings.type';

@Injectable()
export class CommissionService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the same Salesforce `allsalesbooking` Apex REST endpoint (POST) the
   * sales-booking module uses - commissions are nested under each booking's `comissions`
   * array in Salesforce, with no dedicated commission endpoint. This module calls it
   * independently rather than depending on the sales-booking module/service.
   *
   * @param userId - Salesforce user id to fetch sales bookings (and their commissions) for.
   * @returns The raw Apex REST response.
   */
  async getAllCommissionBookings(
    userId: string,
  ): Promise<GetAllCommissionBookingsApexResponse> {
    const payload: GetAllCommissionBookingsApexPayload = { userId };
    const response =
      await this.salesforceClient.http.post<GetAllCommissionBookingsApexResponse>(
        ALL_SALES_BOOKING_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
