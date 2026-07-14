import { CreateEoiResultDto } from './create-eoi-result.dto';
import { CreateModeOfPaymentResultDto } from './create-mode-of-payment-result.dto';
import { UploadDocumentResultDto } from '../../document/dto/upload-document-result.dto';

export class SubmitEoiResultDto {
  eoi: CreateEoiResultDto;
  documents: UploadDocumentResultDto[];
  modeOfPayment: CreateModeOfPaymentResultDto | null;
}
