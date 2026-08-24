import { Module } from '@nestjs/common';
import { NationalityController } from './controller/nationality.controller';
import { NationalityService } from './service/nationality.service';
import { NationalityRepository } from './repository/nationality.repository';

@Module({
  controllers: [NationalityController],
  providers: [NationalityService, NationalityRepository],
})
export class NationalityModule {}
