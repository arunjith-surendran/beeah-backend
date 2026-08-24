import { Injectable } from '@nestjs/common';
import { NATIONALITY_LIST } from '../constants/nationality-list.constant';
import { NationalityOption } from '../types/nationality-option.type';

@Injectable()
export class NationalityRepository {
  /**
   * Returns the fixed nationality list backing the Nationality dropdown -
   * label is the country name (more recognizable), value is the demonym
   * Salesforce's Nationality__c picklist actually expects (see
   * {@link NATIONALITY_LIST}), sorted alphabetically by label.
   *
   * @returns Every entry in {@link NATIONALITY_LIST}, sorted by country name.
   */
  findAll(): NationalityOption[] {
    return [...NATIONALITY_LIST]
      .map(({ country, nationality }) => ({
        label: country,
        value: nationality,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }
}
