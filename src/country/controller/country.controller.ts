import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CountryService } from '../service/country.service';
import { CountryOption } from '../types/country-option.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

@UseGuards(JwtAuthGuard)
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  /**
   * Fetches the fixed country list matching Salesforce's
   * Country/CountryOfResidence restricted picklist exactly, for the
   * Country/CountryOfResidence dropdowns.
   *
   * @returns Every country option wrapped in a `{ message, data }` envelope.
   */
  @Get()
  getCountries(): Promise<ResultWithMessage<CountryOption[]>> {
    return this.countryService.getCountries();
  }
}
