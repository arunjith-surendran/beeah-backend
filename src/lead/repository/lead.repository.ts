import { Injectable } from '@nestjs/common';
import { LeadService as SalesforceLeadService } from '../../salesforce/modules/lead/lead.service';
import {
  CreateLeadApexPayload,
  CreateLeadApexResponse,
} from '../../salesforce/modules/lead/types/create-lead.type';
import { GetLeadsApexResponse } from '../../salesforce/modules/lead/types/get-leads.type';

@Injectable()
export class LeadRepository {
  constructor(private readonly salesforceLeadService: SalesforceLeadService) {}

  /**
   * Passes through to the Salesforce lead service to create a new lead.
   *
   * @param payload - Lead fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Salesforce Apex REST response.
   */
  createLead(payload: CreateLeadApexPayload): Promise<CreateLeadApexResponse> {
    return this.salesforceLeadService.createLead(payload);
  }

  /**
   * Passes through to the Salesforce lead service for a given owner.
   *
   * @param userId - Salesforce user id to fetch leads for.
   * @returns The raw Salesforce Apex REST response.
   */
  getLeadsByUser(userId: string): Promise<GetLeadsApexResponse> {
    return this.salesforceLeadService.getLeadsByUser(userId);
  }
}
