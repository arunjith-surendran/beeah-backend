import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { UnitsService } from './units.service';

@Module({
  imports: [SalesforceModule],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
