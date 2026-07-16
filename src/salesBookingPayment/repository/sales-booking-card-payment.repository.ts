import { Injectable } from '@nestjs/common';
import type { Prisma, SalesBookingCardPayment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SalesBookingCardPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Passes through to Prisma to insert a newly created N-Genius order for a sales booking.
   *
   * @param data - Full details of the created order.
   * @returns The created row.
   */
  create(
    data: Prisma.SalesBookingCardPaymentCreateInput,
  ): Promise<SalesBookingCardPayment> {
    return this.prisma.salesBookingCardPayment.create({ data });
  }

  /**
   * Passes through to Prisma to find a sales booking card payment by its N-Genius order reference.
   *
   * @param orderReference - N-Genius order reference.
   * @returns The matching row, or `null` if none exists.
   */
  findByOrderReference(
    orderReference: string,
  ): Promise<SalesBookingCardPayment | null> {
    return this.prisma.salesBookingCardPayment.findUnique({
      where: { orderReference },
    });
  }

  /**
   * Passes through to Prisma to update a sales booking card payment by its
   * N-Genius order reference - used to sync the latest gateway state on
   * each status poll and, once a Salesforce recording endpoint exists, to
   * stamp the outcome.
   *
   * @param orderReference - N-Genius order reference.
   * @param data - Fields to update.
   * @returns The updated row.
   */
  updateByOrderReference(
    orderReference: string,
    data: Prisma.SalesBookingCardPaymentUpdateInput,
  ): Promise<SalesBookingCardPayment> {
    return this.prisma.salesBookingCardPayment.update({
      where: { orderReference },
      data,
    });
  }
}
