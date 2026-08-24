import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NationalityService } from '../service/nationality.service';
import { NationalityOption } from '../types/nationality-option.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';

@UseGuards(JwtAuthGuard)
@Controller('nationalities')
export class NationalityController {
  constructor(private readonly nationalityService: NationalityService) {}

  /**
   * Fetches the fixed nationality list matching Salesforce's
   * Nationality__c restricted picklist exactly, for the Nationality
   * dropdown.
   *
   * @returns Every nationality option wrapped in a `{ message, data }` envelope.
   */
  @Get()
  getNationalities(): Promise<ResultWithMessage<NationalityOption[]>> {
    return this.nationalityService.getNationalities();
  }
}
