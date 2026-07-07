import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PaymentPlanRepository } from '../repository/payment-plan.repository';
import { PaymentPlanRecord } from '../../salesforce/modules/paymentPlan/types/get-payment-plan.type';
import { PaymentPlanDto } from '../dto/get-payment-plan.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';

@Injectable()
export class PaymentPlanService {
  constructor(private readonly paymentPlanRepository: PaymentPlanRepository) {}

  /**
   * Fetches the payment plan for the given Salesforce building and maps it to `PaymentPlanDto`.
   *
   * @param user - Authenticated user.
   * @param buildingId - Salesforce building id.
   * @returns The building's payment plans wrapped in a `{ message, data }` envelope.
   */
  async getPaymentPlan(
    user: User,
    buildingId: string,
  ): Promise<ResultWithMessage<PaymentPlanDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(buildingId, 'buildingId');

    const response =
      await this.paymentPlanRepository.getPaymentPlan(buildingId);

    return {
      message: response.message,
      data: response.data.map((plan) => this.toPaymentPlanDto(plan)),
    };
  }

  /**
   * Maps a raw Salesforce `PaymentPlanRecord` into the API's `PaymentPlanDto` shape.
   *
   * @param plan - Raw payment plan record returned by the Salesforce Apex REST endpoint.
   * @returns The payment plan shaped for API consumers.
   */
  private toPaymentPlanDto(plan: PaymentPlanRecord): PaymentPlanDto {
    return {
      id: plan.Payment_Plan_Id,
      projectId: plan.Project_Id,
      planName: plan.PlanName,
      status: plan.status,
      paymentTerms: plan.PaymentTerms,
      totalDiscountPercent: plan.Total_Discount_Percent,
      marketingName: plan.Marketing_Name,
      marketingDescription: plan.Marketing_Description,
      customerUnitId: plan.CustomerUnitId,
    };
  }
}
