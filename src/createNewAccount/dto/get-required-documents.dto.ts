import { IsNotEmpty, IsString } from 'class-validator';

// subType is intentionally an opaque string, not an enum - see GetFormDetailsDto.
export class GetRequiredDocumentsDto {
  @IsString()
  @IsNotEmpty()
  subType: string;
}
