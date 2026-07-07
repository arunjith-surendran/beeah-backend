import { Module } from '@nestjs/common';
import { PaymentPlanModule as SalesforcePaymentPlanModule } from '../salesforce/modules/paymentPlan/payment-plan.module';
import { PaymentPlanController } from './controller/payment-plan.controller';
import { PaymentPlanService } from './service/payment-plan.service';
import { PaymentPlanRepository } from './repository/payment-plan.repository';

@Module({
  imports: [SalesforcePaymentPlanModule],
  controllers: [PaymentPlanController],
  providers: [PaymentPlanService, PaymentPlanRepository],
  exports: [PaymentPlanService],
})
export class PaymentPlanModule {}
