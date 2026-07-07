import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { BookingRepository } from '../repository/booking.repository';
import { SalesforceBooking } from '../../salesforce/modules/booking/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { paginate } from '../../common/utils/paginate.util';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  /**
   * Fetches every booking record and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of bookings, with pagination metadata alongside `message`.
   */
  async getAllBookings(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<SalesforceBooking[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const bookings = await this.bookingRepository.getAllBookings();
    const paged = paginate(bookings, pageNumber, pageSize);

    return {
      message: 'Bookings fetched successfully.',
      pagination: {
        pageNumber: paged.pageNumber,
        pageSize: paged.pageSize,
        total: paged.total,
        totalPages: paged.totalPages,
        hasNext: paged.hasNext,
        hasPrevious: paged.hasPrevious,
      },
      data: paged.items,
    };
  }

  /**
   * Fetches a single booking by id.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce booking id.
   * @returns The matching booking.
   */
  getBookingById(user: User, id: string) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.bookingRepository.getBookingById(id);
  }

  /**
   * Maps the incoming DTO to Salesforce field names and creates a new booking.
   *
   * @param user - Authenticated user.
   * @param dto - New booking's details.
   * @returns The created booking.
   */
  createBooking(user: User, dto: CreateBookingDto) {
    unauthorizedException(!!user, 'Unauthorized');
    return this.bookingRepository.createBooking({
      Name: dto.name,
      Unit__c: dto.unitId,
      Project__c: dto.projectId,
      Status__c: dto.status,
    });
  }

  /**
   * Maps the incoming DTO to Salesforce field names and updates an existing booking.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce booking id.
   * @param dto - Fields to update on the booking.
   * @returns The updated booking.
   */
  updateBooking(user: User, id: string, dto: UpdateBookingDto) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.bookingRepository.updateBooking(id, {
      Name: dto.name,
      Unit__c: dto.unitId,
      Project__c: dto.projectId,
      Status__c: dto.status,
    });
  }

  /**
   * Deletes a booking by id.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce booking id.
   * @returns The result of the deletion.
   */
  removeBooking(user: User, id: string) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.bookingRepository.removeBooking(id);
  }
}
