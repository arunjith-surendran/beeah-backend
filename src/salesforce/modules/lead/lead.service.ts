import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { LEADS_APEX_REST_PATH } from '../../network/paths/lead.paths';
import {
  CreateLeadApexPayload,
  CreateLeadApexResponse,
} from './types/create-lead.type';
import { GetLeadsApexResponse } from './types/get-leads.type';

@Injectable()
export class LeadService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `leads` Apex REST endpoint (POST) to create a new lead.
   *
   * @param payload - Lead fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response containing the created lead id.
   */
  async createLead(
    payload: CreateLeadApexPayload,
  ): Promise<CreateLeadApexResponse> {
    const response =
      await this.salesforceClient.http.post<CreateLeadApexResponse>(
        LEADS_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }

  /**
   * Calls the Salesforce `leads` Apex REST endpoint (GET) for a given owner.
   *
   * @param userId - Salesforce user id to fetch leads for.
   * @returns The raw Apex REST response containing the user's lead records.
   */
  async getLeadsByUser(userId: string): Promise<GetLeadsApexResponse> {
    const response = await this.salesforceClient.http.get<GetLeadsApexResponse>(
      LEADS_APEX_REST_PATH,
      { params: { userId } },
    );
    return response.data;
  }
}
