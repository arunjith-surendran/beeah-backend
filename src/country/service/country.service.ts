import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../repository/country.repository';
import { CountryOption } from '../types/country-option.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  /**
   * Fetches the fixed country list matching Salesforce's
   * Country/CountryOfResidence restricted picklist exactly.
   *
   * @returns Every country option wrapped in a `{ message, data }` envelope.
   */
  getCountries(): Promise<ResultWithMessage<CountryOption[]>> {
    return Promise.resolve({
      message: 'Countries fetched successfully',
      data: this.countryRepository.findAll(),
    });
  }
}
