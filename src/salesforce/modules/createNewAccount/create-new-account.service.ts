import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  CREATE_NEW_ACCOUNT_APEX_REST_PATH,
  GET_FORM_DETAILS_APEX_REST_PATH,
} from '../../network/paths/create-new-account.paths';
import {
  CreateNewAccountApexResponse,
  CreateNewAccountPayload,
} from './types/create-new-account.type';
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
   * Calls the Salesforce `getFormDetails` Apex REST endpoint (POST) - a single
   * generic config lookup keyed by `metadataType`, so it also serves the
   * required-documents checklist (metadataType `Broker Document Config`)
   * without a dedicated Apex REST integration for it.
   *
   * @param payload - The mode, metadata type, and agency sub-type to fetch config for.
   * @returns The raw Apex REST response, typed per-caller via `T`.
   */
  async getFormDetails<T = GetFormDetailsApexResponse>(
    payload: GetFormDetailsApexPayload,
  ): Promise<T> {
    const response = await this.salesforceClient.http.post<T>(
      GET_FORM_DETAILS_APEX_REST_PATH,
      payload,
    );
    return response.data;
  }
}
