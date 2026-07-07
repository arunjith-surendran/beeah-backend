import { IsEnum } from 'class-validator';
import { AgencySubType } from './agency-sub-type.enum';

export class GetRequiredDocumentsDto {
  @IsEnum(AgencySubType)
  subType: AgencySubType;
}
