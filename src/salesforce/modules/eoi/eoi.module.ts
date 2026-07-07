import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { EoiService } from './eoi.service';

@Module({
  imports: [SalesforceModule],
  providers: [EoiService],
  exports: [EoiService],
})
export class EoiModule {}
