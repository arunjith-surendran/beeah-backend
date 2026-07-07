import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { SalesOfferService } from '../service/sales-offer.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { CreateSalesOfferDto } from '../dto/create-sales-offer.dto';
import { CreateSalesOfferResultDto } from '../dto/create-sales-offer-result.dto';

@UseGuards(JwtAuthGuard)
@Controller('sales-offers')
export class SalesOfferController {
  constructor(private readonly salesOfferService: SalesOfferService) {}

  /**
   * Creates a new sales offer for the given opportunity.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - New sales offer's details.
   * @returns The created sales offer id wrapped in a `{ message, data }` envelope.
   */
  @Post('create-sales-offer')
  createSalesOffer(
    @CurrentUser() user: User,
    @Body() dto: CreateSalesOfferDto,
  ): Promise<ResultWithMessage<CreateSalesOfferResultDto>> {
    return this.salesOfferService.createSalesOffer(user, dto);
  }
}
