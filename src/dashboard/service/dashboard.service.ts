/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { DashboardRepository } from '../repository/dashboard.repository';
import { DashboardStatusCount } from '../../salesforce/modules/dashboard/types/get-dashboard.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { unauthorizedException } from '../../common/utils/validators.util';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';
import { DashboardDto, StatusCountDto } from '../dto/get-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly salesforceClient: SalesforceClient,
  ) {}

  /**
   * Fetches lead/EOI/booking status counts for the Salesforce user our client-credentials
   * grant authenticates as.
   *
   * @param user - Authenticated user.
   * @param timeLineInDays - Optional time-line window in days to scope the counts to.
   * @returns The dashboard counts wrapped in a `{ message, data }` envelope.
   */
  async getDashboardInformation(
    user: User,
    timeLineInDays?: string,
  ): Promise<ResultWithMessage<DashboardDto>> {
    unauthorizedException(!!user, 'Unauthorized');

    const userId = await this.salesforceClient.getUserId();
    const response = await this.dashboardRepository.getDashboardInformation({
      userId,
      timeLineinDays: timeLineInDays ?? '',
    });

    return {
      message: response.message,
      data: {
        leads: response.leads.map((item) => this.toStatusCountDto(item)),
        eoiDetails: response.eoiDetail.map((item) =>
          this.toStatusCountDto(item),
        ),
        bookings: response.bookings.map((item) => this.toStatusCountDto(item)),
      },
    };
  }

  /**
   * Maps a raw Salesforce status/count pair into the API's `StatusCountDto` shape.
   *
   * @param item - Raw status/count record returned by the Salesforce Apex REST endpoint.
   * @returns The status/count shaped for API consumers.
   */
  private toStatusCountDto(item: DashboardStatusCount): StatusCountDto {
    return { status: item.Status, count: item.count };
  }
}
