import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { CommissionService } from './commission.service';

@Module({
  imports: [SalesforceModule],
  providers: [CommissionService],
  exports: [CommissionService],
})
export class CommissionModule {}
