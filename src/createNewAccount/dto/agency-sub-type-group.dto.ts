import { AgencyCategory } from './agency-category.enum';
import { AgencySubType } from './agency-sub-type.enum';

export class AgencySubTypeGroupDto {
  category: AgencyCategory;
  subTypes: AgencySubType[];
}
