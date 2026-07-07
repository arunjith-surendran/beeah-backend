import { Injectable } from '@nestjs/common';
import {
  BookingService as SalesforceBookingService,
  SalesforceBooking,
} from '../../salesforce/modules/booking/booking.service';

@Injectable()
export class BookingRepository {
  constructor(
    private readonly salesforceBookingService: SalesforceBookingService,
  ) {}

  /**
   * Passes through to the Salesforce booking service.
   *
   * @returns All bookings.
   */
  getAllBookings(): Promise<SalesforceBooking[]> {
    return this.salesforceBookingService.getAllBookings();
  }

  /**
   * Passes through to the Salesforce booking service for a single booking.
   *
   * @param id - Salesforce booking id.
   * @returns The matching booking.
   */
  getBookingById(id: string): Promise<SalesforceBooking> {
    return this.salesforceBookingService.getBookingById(id);
  }

  /**
   * Passes through to the Salesforce booking service to create a booking.
   *
   * @param data - Booking fields in Salesforce field-name shape.
   * @returns The created booking.
   */
  createBooking(data: Partial<SalesforceBooking>) {
    return this.salesforceBookingService.createBooking(data);
  }

  /**
   * Passes through to the Salesforce booking service to update a booking.
   *
   * @param id - Salesforce booking id.
   * @param data - Booking fields to update, in Salesforce field-name shape.
   * @returns The updated booking.
   */
  updateBooking(id: string, data: Partial<SalesforceBooking>) {
    return this.salesforceBookingService.updateBooking(id, data);
  }

  /**
   * Passes through to the Salesforce booking service to delete a booking.
   *
   * @param id - Salesforce booking id.
   * @returns The result of the deletion.
   */
  removeBooking(id: string) {
    return this.salesforceBookingService.removeBooking(id);
  }
}
