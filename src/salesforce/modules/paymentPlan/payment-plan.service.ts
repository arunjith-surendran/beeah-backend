import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { GET_PAYMENT_PLAN_APEX_REST_PATH } from '../../network/paths/payment-plan.paths';
import {
  GetPaymentPlanApexPayload,
  GetPaymentPlanApexResponse,
} from './types/get-payment-plan.type';

@Injectable()
export class PaymentPlanService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `getpaymentplan` Apex REST endpoint (POST) for a given building.
   *
   * @param buildingId - Salesforce building id to fetch the payment plan for.
   * @returns The raw Apex REST response containing the payment plan records.
   */
  async getPaymentPlan(
    buildingId: string,
  ): Promise<GetPaymentPlanApexResponse> {
    const payload: GetPaymentPlanApexPayload = { buildingId };
    const response =
      await this.salesforceClient.http.post<GetPaymentPlanApexResponse>(
        GET_PAYMENT_PLAN_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
