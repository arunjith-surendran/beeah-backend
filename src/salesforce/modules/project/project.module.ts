import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { ProjectService } from './project.service';

@Module({
  imports: [SalesforceModule],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
