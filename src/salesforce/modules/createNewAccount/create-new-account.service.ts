import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  CREATE_NEW_ACCOUNT_APEX_REST_PATH,
  GET_REQUIRED_DOCUMENTS_APEX_REST_PATH,
} from '../../network/paths/create-new-account.paths';
import {
  CreateNewAccountApexResponse,
  CreateNewAccountPayload,
} from './types/create-new-account.type';
import {
  GetRequiredDocumentsApexPayload,
  GetRequiredDocumentsApexResponse,
} from './types/get-required-documents.type';

@Injectable()
export class CreateNewAccountService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  async createNewAccount(
    payload: CreateNewAccountPayload,
  ): Promise<CreateNewAccountApexResponse> {
    const response =
      await this.salesforceClient.http.post<CreateNewAccountApexResponse>(
        CREATE_NEW_ACCOUNT_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }

  /**
   * Calls the Salesforce `getrequireddocuments` Apex REST endpoint (POST) to fetch
   * the mandatory document checklist for a given agency sub-type.
   *
   * @param payload - The agency sub-type to fetch required documents for.
   * @returns The raw Apex REST response containing the mandatory document list.
   */
  async getRequiredDocuments(
    payload: GetRequiredDocumentsApexPayload,
  ): Promise<GetRequiredDocumentsApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetRequiredDocumentsApexResponse>(
        GET_REQUIRED_DOCUMENTS_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
