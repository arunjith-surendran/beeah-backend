import { Injectable } from '@nestjs/common';
import { SalesOfferService as SalesforceSalesOfferService } from '../../salesforce/modules/salesOffer/sales-offer.service';
import {
  CreateSalesOfferApexPayload,
  CreateSalesOfferApexResponse,
} from '../../salesforce/modules/salesOffer/types/create-sales-offer.type';

@Injectable()
export class SalesOfferRepository {
  constructor(
    private readonly salesforceSalesOfferService: SalesforceSalesOfferService,
  ) {}

  /**
   * Passes through to the Salesforce `createsalesoffer` Apex REST endpoint.
   *
   * @param payload - Sales offer fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  createSalesOffer(
    payload: CreateSalesOfferApexPayload,
  ): Promise<CreateSalesOfferApexResponse> {
    return this.salesforceSalesOfferService.createSalesOffer(payload);
  }
}
