import { Module } from '@nestjs/common';
import { CommissionModule as SalesforceCommissionModule } from '../salesforce/modules/commission/commission.module';
import { CommissionController } from './controller/commission.controller';
import { CommissionService } from './service/commission.service';
import { CommissionRepository } from './repository/commission.repository';

@Module({
  imports: [SalesforceCommissionModule],
  controllers: [CommissionController],
  providers: [CommissionService, CommissionRepository],
  exports: [CommissionService],
})
export class CommissionModule {}
