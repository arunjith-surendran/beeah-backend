import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateNewAccountService } from '../service/create-new-account.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CreateNewAccountApexResponse } from '../../salesforce/modules/createNewAccount/types/create-new-account.type';
import { FormFieldConfigRecord } from '../../salesforce/modules/createNewAccount/types/get-form-details.type';
import { RequiredDocumentRecord } from '../../salesforce/modules/createNewAccount/types/get-required-documents.type';
import { GetFormDetailsDto } from '../dto/get-form-details.dto';
import { GetRequiredDocumentsDto } from '../dto/get-required-documents.dto';
import { UploadOnboardingDocumentDto } from '../dto/upload-onboarding-document.dto';

@Controller('create-new-account')
export class CreateNewAccountController {
  constructor(
    private readonly createNewAccountService: CreateNewAccountService,
  ) {}

  /**
   * Fetches the dynamic form field configuration (grouped by section) for a given
   * agency sub-type, so the client can render the onboarding form fully driven by
   * Salesforce config instead of hardcoding sections/fields per sub-type.
   *
   * @param dto - The agency sub-type to fetch form field config for.
   * @returns The form field config grouped by section, wrapped in a `{ message, data }` envelope.
   */
  @Get('form-details')
  getFormDetails(
    @Query() dto: GetFormDetailsDto,
  ): Promise<ResultWithMessage<Record<string, FormFieldConfigRecord[]>>> {
    return this.createNewAccountService.getFormDetails(dto);
  }

  /**
   * Fetches the mandatory document checklist for a given agency sub-type.
   *
   * @param dto - The agency sub-type to fetch required documents for.
   * @returns The mandatory document list wrapped in a `{ message, data }` envelope.
   */
  @Get('required-documents')
  getRequiredDocuments(
    @Query() dto: GetRequiredDocumentsDto,
  ): Promise<ResultWithMessage<RequiredDocumentRecord[]>> {
    return this.createNewAccountService.getRequiredDocuments(dto);
  }

  /**
   * Submits a new agency onboarding application. The body is forwarded to
   * Salesforce as-is - no fixed DTO, since the set of valid sections/fields is
   * entirely config-driven per sub-type (see GET form-details).
   *
   * @param body - The full onboarding submission.
   * @returns The raw Salesforce Apex REST response wrapped in a `{ message, data }` envelope.
   */
  @Post('add')
  create(
    @Body() body: Record<string, unknown>,
  ): Promise<ResultWithMessage<CreateNewAccountApexResponse>> {
    return this.createNewAccountService.createNewAccount(body);
  }

  /**
   * Uploads a single onboarding document ahead of the final `add` submission - no
   * Salesforce record exists yet for it to attach to, so this returns a documentId
   * to reference in that submission's `documents` array instead.
   *
   * @param dto - File name, base64 content, and document type.
   * @returns The created document id wrapped in a `{ message, data }` envelope.
   */
  @Post('upload-document')
  uploadDocument(
    @Body() dto: UploadOnboardingDocumentDto,
  ): Promise<ResultWithMessage<{ documentId: string; azureUrl: string }>> {
    return this.createNewAccountService.uploadDocument(dto);
  }
}
