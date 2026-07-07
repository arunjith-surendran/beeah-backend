import { Module } from '@nestjs/common';
import { LeadModule as SalesforceLeadModule } from '../salesforce/modules/lead/lead.module';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { LeadController } from './controller/lead.controller';
import { LeadService } from './service/lead.service';
import { LeadRepository } from './repository/lead.repository';

@Module({
  imports: [SalesforceLeadModule, SalesforceModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
  exports: [LeadService],
})
export class LeadModule {}
