import { Module } from '@nestjs/common';
import { BookingModule as SalesforceBookingModule } from '../salesforce/modules/booking/booking.module';
import { BookingController } from './controller/booking.controller';
import { BookingService } from './service/booking.service';
import { BookingRepository } from './repository/booking.repository';

@Module({
  imports: [SalesforceBookingModule],
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
})
export class BookingModule {}
