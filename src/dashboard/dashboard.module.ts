import { Module } from '@nestjs/common';
import { DashboardModule as SalesforceDashboardModule } from '../salesforce/modules/dashboard/dashboard.module';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { DashboardController } from './controller/dashboard.controller';
import { DashboardService } from './service/dashboard.service';
import { DashboardRepository } from './repository/dashboard.repository';

@Module({
  imports: [SalesforceDashboardModule, SalesforceModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService],
})
export class DashboardModule {}
