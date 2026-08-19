import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewAccountRepository } from '../repository/create-new-account.repository';
import { CreateNewAccountApexResponse } from '../../salesforce/modules/createNewAccount/types/create-new-account.type';
import { FormFieldConfigRecord } from '../../salesforce/modules/createNewAccount/types/get-form-details.type';
import { RequiredDocumentRecord } from '../../salesforce/modules/createNewAccount/types/get-required-documents.type';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { GetFormDetailsDto } from '../dto/get-form-details.dto';
import { GetRequiredDocumentsDto } from '../dto/get-required-documents.dto';
import { UploadOnboardingDocumentDto } from '../dto/upload-onboarding-document.dto';

// Fixed integration parameters for the `getFormDetails` Apex call - not form
// data, so unlike subType these are legitimately constant regardless of
// sub-type: they identify *which* custom metadata type/mode to read, not which
// fields it contains.
const FORM_DETAILS_MODE = 'registration';
const FORM_DETAILS_METADATA_TYPE = 'Broker Field Config';

@Injectable()
export class CreateNewAccountService {
  constructor(
    private readonly createNewAccountRepository: CreateNewAccountRepository,
  ) {}

  /**
   * Submits a new agency onboarding application. The payload is a pure
   * passthrough - whatever section/field data the client collected from
   * GET /form-details, unvalidated here, since the set of valid
   * sections/fields is entirely config-driven on the Salesforce side.
   *
   * @param payload - The full onboarding submission.
   * @returns The raw Salesforce Apex REST response wrapped in a `{ message, data }` envelope.
   */
  async createNewAccount(
    payload: Record<string, unknown>,
  ): Promise<ResultWithMessage<CreateNewAccountApexResponse>> {
    const response =
      await this.createNewAccountRepository.createNewAccount(payload);

    return {
      message: response.message,
      data: response,
    };
  }

  /**
   * Uploads a single onboarding document ahead of the final create-new-account
   * submission, via the shared Salesforce `uploadDocument` Apex REST endpoint with
   * no recordId (no Salesforce record exists yet for it to attach to). The returned
   * documentId is referenced in the `documents` array of the create-new-account call
   * that follows.
   *
   * @param dto - File name, base64 content, and document type.
   * @returns The created document id wrapped in a `{ message, data }` envelope.
   */
  async uploadDocument(
    dto: UploadOnboardingDocumentDto,
  ): Promise<ResultWithMessage<{ documentId: string; azureUrl: string }>> {
    const response = await this.createNewAccountRepository.uploadDocument({
      fileName: dto.fileName,
      base64: dto.base64,
      documentType: dto.documentType,
    });

    if (!response.result.success) {
      throw new BadRequestException(
        response.result.errorMessage ?? response.message,
      );
    }

    return {
      message: response.message,
      data: {
        documentId: response.result.documentId,
        azureUrl: response.result.azureUrl,
      },
    };
  }

  /**
   * Fetches the mandatory document checklist for a given agency sub-type - fully
   * dynamic, so the client never hardcodes a document type list.
   *
   * @param dto - The agency sub-type to fetch required documents for.
   * @returns The mandatory document list wrapped in a `{ message, data }` envelope.
   */
  async getRequiredDocuments(
    dto: GetRequiredDocumentsDto,
  ): Promise<ResultWithMessage<RequiredDocumentRecord[]>> {
    const response = await this.createNewAccountRepository.getRequiredDocuments(
      { subType: dto.subType },
    );

    return {
      message: response.message,
      data: response.data,
    };
  }

  /**
   * Fetches the dynamic form field configuration (grouped by section) for a given
   * agency sub-type - this is the single source of truth for which sections/fields
   * the onboarding form shows, so the client never hardcodes them per sub-type.
   *
   * @param dto - The agency sub-type to fetch form field config for.
   * @returns The form field config grouped by section, wrapped in a `{ message, data }` envelope.
   */
  async getFormDetails(
    dto: GetFormDetailsDto,
  ): Promise<ResultWithMessage<Record<string, FormFieldConfigRecord[]>>> {
    const data = await this.createNewAccountRepository.getFormDetails({
      mode: FORM_DETAILS_MODE,
      metadataType: FORM_DETAILS_METADATA_TYPE,
      subType: dto.subType,
    });

    return {
      message: 'Form details fetched successfully',
      data,
    };
  }
}
