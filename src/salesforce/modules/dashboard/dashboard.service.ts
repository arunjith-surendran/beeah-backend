import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { DASHBOARD_APEX_REST_PATH } from '../../network/paths/dashboard.paths';
import {
  GetDashboardApexPayload,
  GetDashboardApexResponse,
} from './types/get-dashboard.type';

@Injectable()
export class DashboardService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce dashboard Apex REST endpoint (POST) for a given user.
   *
   * @param payload - Salesforce user id and optional time-line window in days.
   * @returns The raw Apex REST response containing lead/EOI/booking status counts.
   */
  async getDashboardInformation(
    payload: GetDashboardApexPayload,
  ): Promise<GetDashboardApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetDashboardApexResponse>(
        DASHBOARD_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
