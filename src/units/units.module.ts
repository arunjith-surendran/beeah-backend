import { Module } from '@nestjs/common';
import { UnitsModule as SalesforceUnitsModule } from '../salesforce/modules/units/units.module';
import { ProjectModule } from '../project/project.module';
import { UnitsController } from './controller/units.controller';
import { UnitsService } from './service/units.service';
import { UnitsRepository } from './repository/units.repository';

@Module({
  imports: [SalesforceUnitsModule, ProjectModule],
  controllers: [UnitsController],
  providers: [UnitsService, UnitsRepository],
  exports: [UnitsService],
})
export class UnitsModule {}
