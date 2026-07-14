import { IsNumber, IsString } from 'class-validator';

export class UnitPreferenceDto {
  // Matches the frontend's SelectedUnitPreference field name exactly
  // (including the typo) - this is what Salesforce's createEOI endpoint
  // expects in the `preferences` array.
  @IsString()
  unitPrefernce: string;

  @IsNumber()
  noOfUnits: number;

  @IsNumber()
  eoiAmount: number;
}
