import { Module } from '@nestjs/common';
import { ProjectModule as SalesforceProjectModule } from '../salesforce/modules/project/project.module';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { ProjectRepository } from './repository/project.repository';

@Module({
  imports: [SalesforceProjectModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
