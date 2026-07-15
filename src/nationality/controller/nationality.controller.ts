import { Controller, Get } from '@nestjs/common';
import { NationalityService } from '../service/nationality.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { NationalityDto } from '../dto/nationality.dto';

@Controller('nationalities')
export class NationalityController {
  constructor(private readonly nationalityService: NationalityService) {}

  /**
   * Fetches the fixed nationality list for populating a select input. Public -
   * needed on the onboarding (create-new-account) form before the user is logged in.
   *
   * @returns The nationality list, wrapped in a `{ message, data }` envelope.
   */
  @Get()
  getNationalities(): Promise<ResultWithMessage<NationalityDto[]>> {
    return this.nationalityService.getNationalities();
  }
}
