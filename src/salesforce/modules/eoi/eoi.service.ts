import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  CREATE_EOI_APEX_REST_PATH,
  CREATE_MODE_OF_PAYMENT_APEX_REST_PATH,
  EOIS_APEX_REST_PATH,
} from '../../network/paths/eoi.paths';
import {
  CreateEoiApexPayload,
  CreateEoiApexResponse,
} from './types/create-eoi.type';
import { GetEoisApexResponse } from './types/get-eois.type';
import {
  CreateModeOfPaymentApexPayload,
  CreateModeOfPaymentApexResponse,
} from './types/create-mode-of-payment.type';

@Injectable()
export class EoiService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `createEOI` Apex REST endpoint (POST) to create a new EOI.
   *
   * @param payload - EOI fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response containing the created record/lead/account ids.
   */
  async createEoi(
    payload: CreateEoiApexPayload,
  ): Promise<CreateEoiApexResponse> {
    const response =
      await this.salesforceClient.http.post<CreateEoiApexResponse>(
        CREATE_EOI_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }

  /**
   * Calls the Salesforce `eois` Apex REST endpoint (GET) for a given owner.
   *
   * @param userId - Salesforce user id to fetch EOIs for.
   * @returns The raw Apex REST response containing the user's EOI records.
   */
  async getEoisByUser(userId: string): Promise<GetEoisApexResponse> {
    const response = await this.salesforceClient.http.get<GetEoisApexResponse>(
      EOIS_APEX_REST_PATH,
      { params: { userId } },
    );
    return response.data;
  }

  /**
   * Calls the Salesforce `modeofpayments` Apex REST endpoint (POST) to record one or more
   * mode-of-payment entries against an EOI.
   *
   * @param payload - EOI id and mode-of-payment fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  async createModeOfPayment(
    payload: CreateModeOfPaymentApexPayload,
  ): Promise<CreateModeOfPaymentApexResponse> {
    const response =
      await this.salesforceClient.http.post<CreateModeOfPaymentApexResponse>(
        CREATE_MODE_OF_PAYMENT_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
