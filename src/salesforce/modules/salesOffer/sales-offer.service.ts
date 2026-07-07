import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { CREATE_SALES_OFFER_APEX_REST_PATH } from '../../network/paths/sales-offer.paths';
import {
  CreateSalesOfferApexPayload,
  CreateSalesOfferApexResponse,
} from './types/create-sales-offer.type';

@Injectable()
export class SalesOfferService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `createsalesoffer` Apex REST endpoint (POST) to create a new sales offer.
   *
   * @param payload - Sales offer fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response containing the created sales offer id.
   */
  async createSalesOffer(
    payload: CreateSalesOfferApexPayload,
  ): Promise<CreateSalesOfferApexResponse> {
    const response =
      await this.salesforceClient.http.post<CreateSalesOfferApexResponse>(
        CREATE_SALES_OFFER_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
