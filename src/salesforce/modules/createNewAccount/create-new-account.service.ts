import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  CREATE_NEW_ACCOUNT_APEX_REST_PATH,
  GET_FORM_DETAILS_APEX_REST_PATH,
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
import {
  GetFormDetailsApexPayload,
  GetFormDetailsApexResponse,
} from './types/get-form-details.type';

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

  /**
   * Calls the Salesforce `getFormDetails` Apex REST endpoint (POST) to fetch the
   * dynamic form field configuration (grouped by section) for a given agency
   * sub-type and mode - this is the single source of truth for which fields the
   * onboarding form shows, so the frontend never hardcodes fields per sub-type.
   *
   * @param payload - The mode, metadata type, and agency sub-type to fetch form config for.
   * @returns The raw Apex REST response, keyed by section name.
   */
  async getFormDetails(
    payload: GetFormDetailsApexPayload,
  ): Promise<GetFormDetailsApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetFormDetailsApexResponse>(
        GET_FORM_DETAILS_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
