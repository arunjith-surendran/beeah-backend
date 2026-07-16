/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { Prisma, EoiCardPayment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EoiCardPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Passes through to Prisma to insert a newly created N-Genius order for an EOI.
   *
   * @param data - Full details of the created order.
   * @returns The created row.
   */
  create(data: Prisma.EoiCardPaymentCreateInput): Promise<EoiCardPayment> {
    return this.prisma.eoiCardPayment.create({ data });
  }

  /**
   * Passes through to Prisma to find an EOI card payment by its N-Genius order reference.
   *
   * @param orderReference - N-Genius order reference.
   * @returns The matching row, or `null` if none exists.
   */
  findByOrderReference(orderReference: string): Promise<EoiCardPayment | null> {
    return this.prisma.eoiCardPayment.findUnique({ where: { orderReference } });
  }

  /**
   * Passes through to Prisma to find an EOI card payment by its caller-supplied idempotency key.
   *
   * @param idempotencyKey - Idempotency key supplied on order creation.
   * @returns The matching row, or `null` if none exists.
   */
  findByIdempotencyKey(idempotencyKey: string): Promise<EoiCardPayment | null> {
    return this.prisma.eoiCardPayment.findUnique({ where: { idempotencyKey } });
  }

  /**
   * Passes through to Prisma to update an EOI card payment by its N-Genius
   * order reference - used to sync the latest gateway state on each status
   * poll and, once recorded in Salesforce, to stamp the outcome.
   *
   * @param orderReference - N-Genius order reference.
   * @param data - Fields to update.
   * @returns The updated row.
   */
  updateByOrderReference(
    orderReference: string,
    data: Prisma.EoiCardPaymentUpdateInput,
  ): Promise<EoiCardPayment> {
    return this.prisma.eoiCardPayment.update({
      where: { orderReference },
      data,
    });
  }
}
