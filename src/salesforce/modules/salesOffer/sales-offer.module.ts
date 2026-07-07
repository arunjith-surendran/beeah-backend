import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { SalesOfferService } from './sales-offer.service';

@Module({
  imports: [SalesforceModule],
  providers: [SalesOfferService],
  exports: [SalesOfferService],
})
export class SalesOfferModule {}
