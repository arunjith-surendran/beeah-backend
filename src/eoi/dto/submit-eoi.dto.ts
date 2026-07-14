import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { CreateEoiDto } from './create-eoi.dto';
import { ModeOfPaymentDto } from './mode-of-payment.dto';
import { SubmitEoiDocumentDto } from './submit-eoi-document.dto';

export class SubmitEoiDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateEoiDto)
  eoiInfo: CreateEoiDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitEoiDocumentDto)
  documents?: SubmitEoiDocumentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModeOfPaymentDto)
  modeOfPayments?: ModeOfPaymentDto[];
}
