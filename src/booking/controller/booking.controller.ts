import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Fetches every booking record, paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of bookings.
   */
  @Get()
  getAllBookings(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.bookingService.getAllBookings(user, pageNumber, pageSize);
  }

  /**
   * Fetches a single booking by id.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce booking id, taken from the route path.
   * @returns The matching booking.
   */
  @Get(':id')
  getBookingById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bookingService.getBookingById(user, id);
  }

  /**
   * Creates a new booking.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - New booking's details.
   * @returns The created booking.
   */
  @Post()
  createBooking(@CurrentUser() user: User, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(user, dto);
  }

  /**
   * Updates an existing booking.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce booking id, taken from the route path.
   * @param dto - Fields to update on the booking.
   * @returns The updated booking.
   */
  @Patch(':id')
  updateBooking(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(user, id, dto);
  }

  /**
   * Deletes a booking by id.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce booking id, taken from the route path.
   * @returns The result of the deletion.
   */
  @Delete(':id')
  removeBooking(@CurrentUser() user: User, @Param('id') id: string) {
    return this.bookingService.removeBooking(user, id);
  }
}
