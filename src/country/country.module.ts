import { Module } from '@nestjs/common';
import { CountryController } from './controller/country.controller';
import { CountryService } from './service/country.service';
import { CountryRepository } from './repository/country.repository';

@Module({
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
})
export class CountryModule {}
