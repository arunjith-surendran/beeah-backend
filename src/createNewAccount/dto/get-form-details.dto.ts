import { IsNotEmpty, IsString } from 'class-validator';

// subType is intentionally an opaque string, not an enum - Salesforce's "Broker
// Field Config" metadata owns the set of valid sub-types, not this backend.
export class GetFormDetailsDto {
  @IsString()
  @IsNotEmpty()
  subType: string;
}
