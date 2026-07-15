import { Controller, Get } from '@nestjs/common';
import { CountryService } from '../service/country.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CountryDto } from '../dto/country.dto';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  /**
   * Fetches the fixed country list for populating a select input. Public -
   * needed on the onboarding (create-new-account) form before the user is logged in.
   *
   * @returns The country list, wrapped in a `{ message, data }` envelope.
   */
  @Get()
  getCountries(): Promise<ResultWithMessage<CountryDto[]>> {
    return this.countryService.getCountries();
  }
}
