import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { ModeOfPaymentDto } from './mode-of-payment.dto';

export class CreateModeOfPaymentDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ModeOfPaymentDto)
  modeOfPayments: ModeOfPaymentDto[];
}
