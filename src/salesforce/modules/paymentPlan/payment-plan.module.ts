import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { PaymentPlanService } from './payment-plan.service';

@Module({
  imports: [SalesforceModule],
  providers: [PaymentPlanService],
  exports: [PaymentPlanService],
})
export class PaymentPlanModule {}
