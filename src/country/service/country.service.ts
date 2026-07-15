import { Injectable } from '@nestjs/common';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CountryDto } from '../dto/country.dto';
import { COUNTRY_LIST } from '../constants/country-list.constant';

@Injectable()
export class CountryService {
  /**
   * Fetches the fixed country list for populating a select input. Label and
   * value are the same string, matching Salesforce's Country picklist.
   *
   * @returns The country list, wrapped in a `{ message, data }` envelope.
   */
  getCountries(): Promise<ResultWithMessage<CountryDto[]>> {
    const data = COUNTRY_LIST.map((country) => ({
      label: country,
      value: country,
    }));

    return Promise.resolve({
      message: 'Countries fetched successfully',
      data,
    });
  }
}
