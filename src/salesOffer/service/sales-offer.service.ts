import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { SalesOfferRepository } from '../repository/sales-offer.repository';
import { CreateSalesOfferApexPayload } from '../../salesforce/modules/salesOffer/types/create-sales-offer.type';
import { CreateSalesOfferDto } from '../dto/create-sales-offer.dto';
import { CreateSalesOfferResultDto } from '../dto/create-sales-offer-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { unauthorizedException } from '../../common/utils/validators.util';

@Injectable()
export class SalesOfferService {
  constructor(private readonly salesOfferRepository: SalesOfferRepository) {}

  /**
   * Builds the Salesforce `createsalesoffer` payload from the client DTO and submits it.
   *
   * @param user - Authenticated user.
   * @param dto - New sales offer's details.
   * @returns The created sales offer id wrapped in a `{ message, data }` envelope.
   */
  async createSalesOffer(
    user: User,
    dto: CreateSalesOfferDto,
  ): Promise<ResultWithMessage<CreateSalesOfferResultDto>> {
    unauthorizedException(!!user, 'Unauthorized');

    const payload: CreateSalesOfferApexPayload = {
      name: dto.name,
      opportunityId: dto.opportunityId,
      description: dto.description,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      sellingPrice: dto.sellingPrice,
    };
    const response = await this.salesOfferRepository.createSalesOffer(payload);

    return {
      message: response.message,
      data: { salesOfferId: response.salesOfferId },
    };
  }
}
