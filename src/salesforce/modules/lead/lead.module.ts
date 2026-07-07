import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { LeadService } from './lead.service';

@Module({
  imports: [SalesforceModule],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
