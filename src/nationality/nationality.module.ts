import { Module } from '@nestjs/common';
import { NationalityController } from './controller/nationality.controller';
import { NationalityService } from './service/nationality.service';

@Module({
  controllers: [NationalityController],
  providers: [NationalityService],
})
export class NationalityModule {}
