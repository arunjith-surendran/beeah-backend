import { Injectable } from '@nestjs/common';
import { COUNTRY_LIST } from '../constants/country-list.constant';
import { CountryOption } from '../types/country-option.type';

@Injectable()
export class CountryRepository {
  /**
   * Returns the fixed country list backing the Country/CountryOfResidence
   * dropdown - label and value are the same string since Salesforce's
   * restricted picklist has no separate display label.
   *
   * @returns Every entry in {@link COUNTRY_LIST}, in picklist order.
   */
  findAll(): CountryOption[] {
    return COUNTRY_LIST.map((country) => ({
      label: country,
      value: country,
    }));
  }
}
