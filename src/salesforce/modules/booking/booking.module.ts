import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { BookingService } from './booking.service';

@Module({
  imports: [SalesforceModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
