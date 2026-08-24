import { Injectable } from '@nestjs/common';
import { CommissionService as SalesforceCommissionService } from '../../salesforce/modules/commission/commission.service';
import { GetAllCommissionBookingsApexResponse } from '../../salesforce/modules/commission/types/get-commission-bookings.type';
import {
  UploadInvoiceApexPayload,
  UploadInvoiceApexResponse,
} from '../../salesforce/modules/commission/types/upload-invoice.type';

@Injectable()
export class CommissionRepository {
  constructor(
    private readonly salesforceCommissionService: SalesforceCommissionService,
  ) {}

  /**
   * Passes through to the Salesforce commission service.
   *
   * @param userId - Salesforce user id to fetch sales bookings (and their commissions) for.
   * @returns The raw Apex REST response.
   */
  getAllCommissionBookings(
    userId: string,
  ): Promise<GetAllCommissionBookingsApexResponse> {
    return this.salesforceCommissionService.getAllCommissionBookings(userId);
  }

  /**
   * Passes through to the Salesforce commission service to upload a commission invoice.
   *
   * @param payload - Invoice file fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  uploadInvoice(
    payload: UploadInvoiceApexPayload,
  ): Promise<UploadInvoiceApexResponse> {
    return this.salesforceCommissionService.uploadInvoice(payload);
  }
}
