import { Module } from '@nestjs/common';
import { SalesOfferModule as SalesforceSalesOfferModule } from '../salesforce/modules/salesOffer/sales-offer.module';
import { SalesOfferController } from './controller/sales-offer.controller';
import { SalesOfferService } from './service/sales-offer.service';
import { SalesOfferRepository } from './repository/sales-offer.repository';

@Module({
  imports: [SalesforceSalesOfferModule],
  controllers: [SalesOfferController],
  providers: [SalesOfferService, SalesOfferRepository],
  exports: [SalesOfferService],
})
export class SalesOfferModule {}
