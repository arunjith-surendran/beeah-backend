import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  BOOKING_FIELDS,
  BOOKING_SOBJECT,
  bookingPath,
} from '../../network/paths/booking.paths';

export interface SalesforceBooking {
  Id: string;
  Name?: string;
  Unit__c?: string;
  Project__c?: string;
  Status__c?: string;
  [key: string]: unknown;
}

interface SalesforceQueryResult<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

@Injectable()
export class BookingService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  async getAllBookings(limit = 50): Promise<SalesforceBooking[]> {
    const response = await this.salesforceClient.http.get<
      SalesforceQueryResult<SalesforceBooking>
    >('/query', {
      params: {
        q: `SELECT ${BOOKING_FIELDS.join(', ')} FROM ${BOOKING_SOBJECT} LIMIT ${limit}`,
      },
    });
    return response.data.records;
  }

  async getBookingById(id: string): Promise<SalesforceBooking> {
    const response = await this.salesforceClient.http.get<SalesforceBooking>(
      bookingPath(id),
    );
    return response.data;
  }

  async createBooking(data: Partial<SalesforceBooking>) {
    const response = await this.salesforceClient.http.post<{
      id: string;
      success: boolean;
    }>(bookingPath(), data);
    return response.data;
  }

  async updateBooking(id: string, data: Partial<SalesforceBooking>) {
    await this.salesforceClient.http.patch(bookingPath(id), data);
  }

  async removeBooking(id: string) {
    await this.salesforceClient.http.delete(bookingPath(id));
  }
}
