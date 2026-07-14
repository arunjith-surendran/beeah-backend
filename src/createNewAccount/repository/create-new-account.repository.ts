import { Injectable } from '@nestjs/common';
import { CreateNewAccountService as SalesforceCreateNewAccountService } from '../../salesforce/modules/createNewAccount/create-new-account.service';
import {
  CreateNewAccountApexResponse,
  CreateNewAccountPayload,
} from '../../salesforce/modules/createNewAccount/types/create-new-account.type';
import {
  GetRequiredDocumentsApexPayload,
  GetRequiredDocumentsApexResponse,
} from '../../salesforce/modules/createNewAccount/types/get-required-documents.type';
import { DocumentService as SalesforceDocumentService } from '../../salesforce/modules/document/document.service';
import {
  UploadDocumentApexPayload,
  UploadDocumentApexResponse,
} from '../../salesforce/modules/document/types/upload-document.type';

@Injectable()
export class CreateNewAccountRepository {
  constructor(
    private readonly salesforceCreateNewAccountService: SalesforceCreateNewAccountService,
    private readonly salesforceDocumentService: SalesforceDocumentService,
  ) {}

  /**
   * Passes through to the Salesforce create-new-account service.
   *
   * @param payload - Onboarding, bank, and document fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Salesforce Apex REST response.
   */
  createNewAccount(
    payload: CreateNewAccountPayload,
  ): Promise<CreateNewAccountApexResponse> {
    return this.salesforceCreateNewAccountService.createNewAccount(payload);
  }

  /**
   * Passes through to the Salesforce `getrequireddocuments` Apex REST endpoint.
   *
   * @param payload - The agency sub-type to fetch required documents for.
   * @returns The raw Apex REST response.
   */
  getRequiredDocuments(
    payload: GetRequiredDocumentsApexPayload,
  ): Promise<GetRequiredDocumentsApexResponse> {
    return this.salesforceCreateNewAccountService.getRequiredDocuments(payload);
  }

  /**
   * Passes through to the shared Salesforce `uploadDocument` Apex REST endpoint,
   * without a recordId - used to upload onboarding documents before the account
   * (and therefore any Salesforce record to attach them to) exists.
   *
   * @param payload - File name, base64 content, and document type.
   * @returns The raw Apex REST response containing the created document id.
   */
  uploadDocument(
    payload: UploadDocumentApexPayload,
  ): Promise<UploadDocumentApexResponse> {
    return this.salesforceDocumentService.uploadDocument(payload);
  }
}
