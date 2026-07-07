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

@Injectable()
export class CreateNewAccountRepository {
  constructor(
    private readonly salesforceCreateNewAccountService: SalesforceCreateNewAccountService,
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
}
