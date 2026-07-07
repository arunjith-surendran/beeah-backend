import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [SalesforceModule],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
