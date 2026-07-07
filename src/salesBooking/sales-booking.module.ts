import { Module } from '@nestjs/common';
import { SalesBookingModule as SalesforceSalesBookingModule } from '../salesforce/modules/salesBooking/sales-booking.module';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { SalesBookingController } from './controller/sales-booking.controller';
import { SalesBookingService } from './service/sales-booking.service';
import { SalesBookingRepository } from './repository/sales-booking.repository';

@Module({
  imports: [SalesforceSalesBookingModule, SalesforceModule],
  controllers: [SalesBookingController],
  providers: [SalesBookingService, SalesBookingRepository],
  exports: [SalesBookingService],
})
export class SalesBookingModule {}
