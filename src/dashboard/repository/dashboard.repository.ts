import { Injectable } from '@nestjs/common';
import { DashboardService as SalesforceDashboardService } from '../../salesforce/modules/dashboard/dashboard.service';
import {
  GetDashboardApexPayload,
  GetDashboardApexResponse,
} from '../../salesforce/modules/dashboard/types/get-dashboard.type';

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly salesforceDashboardService: SalesforceDashboardService,
  ) {}

  /**
   * Passes through to the Salesforce dashboard service.
   *
   * @param payload - Salesforce user id and optional time-line window in days.
   * @returns The raw Salesforce Apex REST response.
   */
  getDashboardInformation(
    payload: GetDashboardApexPayload,
  ): Promise<GetDashboardApexResponse> {
    return this.salesforceDashboardService.getDashboardInformation(payload);
  }
}
