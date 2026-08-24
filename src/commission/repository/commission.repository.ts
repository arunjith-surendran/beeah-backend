import { Injectable } from '@nestjs/common';
import { CommissionService as SalesforceCommissionService } from '../../salesforce/modules/commission/commission.service';
import { GetAllCommissionBookingsApexResponse } from '../../salesforce/modules/commission/types/get-commission-bookings.type';

@Injectable()
export class CommissionRepository {
  constructor(
    private readonly salesforceCommissionService: SalesforceCommissionService,
  ) {}

  /**
   * Passes through to the Salesforce commission service.
   *
   * @param userId - Salesforce user id to fetch sales bookings (and their commissions) for.
   * @returns The raw Apex REST response.
   */
  getAllCommissionBookings(
    userId: string,
  ): Promise<GetAllCommissionBookingsApexResponse> {
    return this.salesforceCommissionService.getAllCommissionBookings(userId);
  }
}
