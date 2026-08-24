import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CommissionRepository } from '../repository/commission.repository';
import {
  CommissionBookingRecord,
  CommissionRecord,
} from '../../salesforce/modules/commission/types/get-commission-bookings.type';
import {
  CommissionDto,
  CommissionStatusVariant,
} from '../dto/get-commissions.dto';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import { unauthorizedException } from '../../common/utils/validators.util';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';

const NOT_AVAILABLE = '-';

export interface CommissionFilters {
  search?: string;
  project?: string;
  // Raw value from the frontend's date-created dropdown: a number of days back from
  // today (e.g. '7'), a 'startDate,endDate' (YYYY-MM-DD) custom range, or empty/'0' for
  // no filter. Mirrors `doesDateMatchFilter`'s encoding on the frontend.
  dateSelected?: string;
}

@Injectable()
export class CommissionService {
  constructor(
    private readonly commissionRepository: CommissionRepository,
    private readonly salesforceClient: SalesforceClient,
  ) {}

  /**
   * Fetches every sales booking owned by the Salesforce user our client-credentials grant
   * authenticates as, flattens each booking's `comissions` array into one row per
   * commission (Salesforce nests commissions under bookings; there's no dedicated
   * commission list endpoint), applies `filters`, and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @param filters - Optional search text and booking-date range to filter by.
   * @returns The requested page of commissions, with pagination metadata alongside `message`.
   */
  async getAllCommissions(
    user: User,
    pageNumber?: string,
    pageSize?: string,
    filters: CommissionFilters = {},
  ): Promise<PaginatedResultWithMessage<CommissionDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const userId = await this.salesforceClient.getUserId();
    const response =
      await this.commissionRepository.getAllCommissionBookings(userId);

    const commissions = response.data
      .filter(
        (booking) =>
          this.matchesDateSelected(booking.bookingDate, filters.dateSelected) &&
          this.matchesProject(
            booking.inventoryData?.projectName ?? null,
            filters.project,
          ),
      )
      .flatMap((booking) =>
        (booking.comissions ?? []).map((commission) =>
          this.toCommissionDto(booking, commission),
        ),
      )
      .filter((commission) => this.matchesSearch(commission, filters.search));
    const paged = paginate(commissions, pageNumber, pageSize);

    return {
      message: response.message,
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
   * Applies the date-created dropdown filter. `dateSelected` is either a
   * `'startDate,endDate'` (`YYYY-MM-DD`) custom range, a number of days back from today
   * (e.g. `'7'`), or empty/`'0'` for no filter - the same encoding
   * `doesDateMatchFilter` uses on the frontend. Everything is compared as `YYYY-MM-DD`
   * strings, so there's no timezone drift to worry about.
   *
   * @param bookingDate - Raw booking date (`YYYY-MM-DD`), or null.
   * @param dateSelected - Raw dropdown value, if any.
   * @returns Whether the booking falls within the requested range.
   */
  private matchesDateSelected(
    bookingDate: string | null,
    dateSelected?: string,
  ): boolean {
    if (!dateSelected || dateSelected === '0') {
      return true;
    }
    if (!bookingDate) {
      return false;
    }

    if (dateSelected.includes(',')) {
      const [start, end] = dateSelected.split(',');
      if (start && bookingDate < start) {
        return false;
      }
      if (end && bookingDate > end) {
        return false;
      }
      return true;
    }

    const daysAgo = Number(dateSelected);
    if (!Number.isFinite(daysAgo) || daysAgo <= 0) {
      return true;
    }
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - daysAgo);
    const cutoffDate = cutoff.toISOString().slice(0, 10);
    return bookingDate >= cutoffDate;
  }

  /**
   * Applies the project-name dropdown filter: case-insensitive exact match.
   *
   * @param projectName - Booking's project name, or null.
   * @param project - Selected project name, if any.
   * @returns Whether the booking matches.
   */
  private matchesProject(
    projectName: string | null,
    project?: string,
  ): boolean {
    if (!project) {
      return true;
    }
    return (projectName ?? '').toLowerCase() === project.toLowerCase();
  }

  /**
   * Applies the `search` filter: case-insensitive substring match against unit name,
   * project, and status.
   *
   * @param commission - Mapped commission to test.
   * @param search - Search text, if any.
   * @returns Whether the commission matches.
   */
  private matchesSearch(commission: CommissionDto, search?: string): boolean {
    if (!search) {
      return true;
    }
    const query = search.toLowerCase();
    const haystack =
      `${commission.unitName} ${commission.project} ${commission.status}`.toLowerCase();
    return haystack.includes(query);
  }

  /**
   * Maps a raw Salesforce sales booking + one of its commissions into the API's
   * `CommissionDto` shape.
   *
   * @param booking - Raw sales booking record the commission belongs to.
   * @param commission - Raw commission record, nested under the booking.
   * @returns The commission shaped for API consumers.
   */
  private toCommissionDto(
    booking: CommissionBookingRecord,
    commission: CommissionRecord,
  ): CommissionDto {
    const amount = commission.commissionAmount ?? 0;
    // `invoiceStatus` reflects the later, post-approval invoice/payment stage; once it's
    // set it's more specific than the approval-chain `commissionStatus`, so prefer it.
    const status =
      commission.invoiceStatus ??
      commission.commissionStatus ??
      'Pending Approval';
    const isPaid = status === 'Payment Completed';

    return {
      id: commission.name,
      unitName: booking.inventoryData?.unitName ?? NOT_AVAILABLE,
      dateOfBooking: this.formatDate(booking.bookingDate),
      project: booking.inventoryData?.projectName ?? NOT_AVAILABLE,
      price: booking.sellingPrice !== null ? Number(booking.sellingPrice) : 0,
      status,
      statusVariant: this.mapStatusVariant(status),
      canUploadInvoice: status === 'Pending Invoice Upload by Broker',
      commissionRate:
        commission.commissionPercent !== null
          ? `${commission.commissionPercent}%`
          : NOT_AVAILABLE,
      commissionAmount: amount,
      commissionReceived: isPaid ? amount : 0,
      commissionPending: isPaid ? 0 : amount,
    };
  }

  /**
   * Derives a display color for any commission status by keyword, so the frontend never
   * has to hardcode a status -> color mapping (and new Salesforce picklist values still
   * get a sensible color instead of breaking). Checked in this order so overlapping
   * substrings resolve correctly - e.g. "Eligibility Criteria Not Met" contains "met" but
   * must be caught by the "not met"/"not eligible" check first.
   *
   * @param status - Resolved commission status text.
   * @returns The `Chip` variant to render it with.
   */
  private mapStatusVariant(status: string): CommissionStatusVariant {
    const value = status.toLowerCase();

    if (
      value.includes('not eligible') ||
      value.includes('not met') ||
      value.includes('reject')
    ) {
      return 'error';
    }
    if (
      value === 'payment completed' ||
      value.includes('approved') ||
      value.includes('met')
    ) {
      return 'success';
    }
    return 'warning';
  }

  /**
   * Formats a Salesforce `YYYY-MM-DD` date string as `MMM D, YYYY` (e.g. `Jul 14, 2026`),
   * matching the format the commission card displays.
   *
   * @param date - Raw date string, or null.
   * @returns The formatted date, or a placeholder if `date` is null/unparseable.
   */
  private formatDate(date: string | null): string {
    if (!date) {
      return NOT_AVAILABLE;
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return NOT_AVAILABLE;
    }
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
}
