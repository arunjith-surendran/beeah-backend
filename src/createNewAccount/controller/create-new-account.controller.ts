import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNewAccountService } from '../service/create-new-account.service';
import { CreateNewAccountDto } from '../dto/create-new-account.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CreateNewAccountResultDto } from '../dto/create-new-account-result.dto';
import { GetRequiredDocumentsDto } from '../dto/get-required-documents.dto';
import { RequiredDocumentDto } from '../dto/required-document.dto';
import { UploadOnboardingDocumentDto } from '../dto/upload-onboarding-document.dto';
import { UploadOnboardingDocumentResultDto } from '../dto/upload-onboarding-document-result.dto';
import { AgencySubTypeGroupDto } from '../dto/agency-sub-type-group.dto';

@Controller('create-new-account')
export class CreateNewAccountController {
  constructor(
    private readonly createNewAccountService: CreateNewAccountService,
  ) {}

  /**
   * Submits a new agency onboarding application, including bank and document details.
   *
   * @param dto - Onboarding, bank, and document details submitted by the client.
   * @returns The created onboarding and bank record ids wrapped in a `{ message, data }` envelope.
   */
  @Post('add')
  create(
    @Body() dto: CreateNewAccountDto,
  ): Promise<ResultWithMessage<CreateNewAccountResultDto>> {
    return this.createNewAccountService.createNewAccount(dto);
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
  ): Promise<ResultWithMessage<UploadOnboardingDocumentResultDto>> {
    return this.createNewAccountService.uploadDocument(dto);
  }

  /**
   * Fetches the mandatory document checklist for a given agency sub-type.
   *
   * @param dto - The agency sub-type to fetch required documents for.
   * @returns The mandatory document list wrapped in a `{ message, data }` envelope.
   */
  @Get('get-required-documents')
  getRequiredDocuments(
    @Body() dto: GetRequiredDocumentsDto,
  ): Promise<ResultWithMessage<RequiredDocumentDto[]>> {
    return this.createNewAccountService.getRequiredDocuments(dto);
  }

  /**
   * Fetches the valid agency sub-types for every category, for populating the onboarding form.
   *
   * @returns The agency sub-types grouped by category, wrapped in a `{ message, data }` envelope.
   */
  @Get('sub-types')
  getAgencySubTypes(): Promise<ResultWithMessage<AgencySubTypeGroupDto[]>> {
    return this.createNewAccountService.getAgencySubTypes();
  }
}
