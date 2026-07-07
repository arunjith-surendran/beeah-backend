import { Injectable } from '@nestjs/common';
import { EoiService as SalesforceEoiService } from '../../salesforce/modules/eoi/eoi.service';
import {
  CreateEoiApexPayload,
  CreateEoiApexResponse,
} from '../../salesforce/modules/eoi/types/create-eoi.type';
import { GetEoisApexResponse } from '../../salesforce/modules/eoi/types/get-eois.type';
import {
  CreateModeOfPaymentApexPayload,
  CreateModeOfPaymentApexResponse,
} from '../../salesforce/modules/eoi/types/create-mode-of-payment.type';

@Injectable()
export class EoiRepository {
  constructor(private readonly salesforceEoiService: SalesforceEoiService) {}

  /**
   * Passes through to the Salesforce `createEOI` Apex REST endpoint.
   *
   * @param payload - EOI fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  createEoi(payload: CreateEoiApexPayload): Promise<CreateEoiApexResponse> {
    return this.salesforceEoiService.createEoi(payload);
  }

  /**
   * Passes through to the Salesforce EOI service for a given owner.
   *
   * @param userId - Salesforce user id to fetch EOIs for.
   * @returns The raw Apex REST response.
   */
  getEoisByUser(userId: string): Promise<GetEoisApexResponse> {
    return this.salesforceEoiService.getEoisByUser(userId);
  }

  /**
   * Passes through to the Salesforce `modeofpayments` Apex REST endpoint.
   *
   * @param payload - EOI id and mode-of-payment fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  createModeOfPayment(
    payload: CreateModeOfPaymentApexPayload,
  ): Promise<CreateModeOfPaymentApexResponse> {
    return this.salesforceEoiService.createModeOfPayment(payload);
  }
}
