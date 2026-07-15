import { Module } from '@nestjs/common';
import { CountryController } from './controller/country.controller';
import { CountryService } from './service/country.service';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
})
export class CountryModule {}
