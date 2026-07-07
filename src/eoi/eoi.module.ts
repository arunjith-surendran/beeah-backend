import { Module } from '@nestjs/common';
import { EoiModule as SalesforceEoiModule } from '../salesforce/modules/eoi/eoi.module';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { EoiController } from './controller/eoi.controller';
import { EoiService } from './service/eoi.service';
import { EoiRepository } from './repository/eoi.repository';

@Module({
  imports: [SalesforceEoiModule, SalesforceModule],
  controllers: [EoiController],
  providers: [EoiService, EoiRepository],
  exports: [EoiService],
})
export class EoiModule {}
