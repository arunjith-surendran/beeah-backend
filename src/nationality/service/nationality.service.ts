import { Injectable } from '@nestjs/common';
import { NationalityRepository } from '../repository/nationality.repository';
import { NationalityOption } from '../types/nationality-option.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

@Injectable()
export class NationalityService {
  constructor(private readonly nationalityRepository: NationalityRepository) {}

  /**
   * Fetches the fixed nationality list matching Salesforce's Nationality__c
   * restricted picklist exactly.
   *
   * @returns Every nationality option wrapped in a `{ message, data }` envelope.
   */
  getNationalities(): Promise<ResultWithMessage<NationalityOption[]>> {
    return Promise.resolve({
      message: 'Nationalities fetched successfully',
      data: this.nationalityRepository.findAll(),
    });
  }
}
