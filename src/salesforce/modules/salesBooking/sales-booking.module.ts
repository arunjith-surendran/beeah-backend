import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { SalesBookingService } from './sales-booking.service';

@Module({
  imports: [SalesforceModule],
  providers: [SalesBookingService],
  exports: [SalesBookingService],
})
export class SalesBookingModule {}
