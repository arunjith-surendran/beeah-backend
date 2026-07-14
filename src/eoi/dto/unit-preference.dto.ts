import { IsNumber, IsString } from 'class-validator';

export class UnitPreferenceDto {
  @IsString()
  unitType: string;

  @IsNumber()
  noOfUnits: number;

  @IsNumber()
  eoiAmount: number;
}
