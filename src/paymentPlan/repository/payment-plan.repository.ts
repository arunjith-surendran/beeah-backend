import { Injectable } from '@nestjs/common';
import { PaymentPlanService as SalesforcePaymentPlanService } from '../../salesforce/modules/paymentPlan/payment-plan.service';
import { GetPaymentPlanApexResponse } from '../../salesforce/modules/paymentPlan/types/get-payment-plan.type';

@Injectable()
export class PaymentPlanRepository {
  constructor(
    private readonly salesforcePaymentPlanService: SalesforcePaymentPlanService,
  ) {}

  /**
   * Passes through to the Salesforce `getpaymentplan` Apex REST endpoint.
   *
   * @param buildingId - Salesforce building id to fetch the payment plan for.
   * @returns The raw Apex REST response.
   */
  getPaymentPlan(buildingId: string): Promise<GetPaymentPlanApexResponse> {
    return this.salesforcePaymentPlanService.getPaymentPlan(buildingId);
  }
}
