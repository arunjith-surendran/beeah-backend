import { Injectable } from '@nestjs/common';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { NationalityDto } from '../dto/nationality.dto';
import { NATIONALITY_LIST } from '../constants/nationality-list.constant';

@Injectable()
export class NationalityService {
  /**
   * Fetches the fixed nationality list for populating a select input. Label and
   * value are the same string, matching Salesforce's Nationality__c picklist.
   *
   * @returns The nationality list, wrapped in a `{ message, data }` envelope.
   */
  getNationalities(): Promise<ResultWithMessage<NationalityDto[]>> {
    const data = NATIONALITY_LIST.map((nationality) => ({
      label: nationality,
      value: nationality,
    }));

    return Promise.resolve({
      message: 'Nationalities fetched successfully',
      data,
    });
  }
}
