import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CommissionRepository } from '../repository/commission.repository';
import { SalesforceCommission } from '../../salesforce/modules/commission/commission.service';
import { CreateCommissionDto } from '../dto/create-commission.dto';
import { UpdateCommissionDto } from '../dto/update-commission.dto';
import { paginate } from '../../common/utils/paginate.util';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';

@Injectable()
export class CommissionService {
  constructor(private readonly commissionRepository: CommissionRepository) {}

  /**
   * Fetches every commission record and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of commissions, with pagination metadata alongside `message`.
   */
  async getAllCommissions(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<SalesforceCommission[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const commissions = await this.commissionRepository.getAllCommissions();
    const paged = paginate(commissions, pageNumber, pageSize);

    return {
      message: 'Commissions fetched successfully.',
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
   * Fetches a single commission by id.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce commission id.
   * @returns The matching commission.
   */
  getCommissionById(user: User, id: string) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.commissionRepository.getCommissionById(id);
  }

  /**
   * Maps the incoming DTO to Salesforce field names and creates a new commission.
   *
   * @param user - Authenticated user.
   * @param dto - New commission's details.
   * @returns The created commission.
   */
  createCommission(user: User, dto: CreateCommissionDto) {
    unauthorizedException(!!user, 'Unauthorized');
    return this.commissionRepository.createCommission({
      Name: dto.name,
      Amount__c: dto.amount,
      Status__c: dto.status,
      Booking__c: dto.bookingId,
    });
  }

  /**
   * Maps the incoming DTO to Salesforce field names and updates an existing commission.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce commission id.
   * @param dto - Fields to update on the commission.
   * @returns The updated commission.
   */
  updateCommission(user: User, id: string, dto: UpdateCommissionDto) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.commissionRepository.updateCommission(id, {
      Name: dto.name,
      Amount__c: dto.amount,
      Status__c: dto.status,
      Booking__c: dto.bookingId,
    });
  }

  /**
   * Deletes a commission by id.
   *
   * @param user - Authenticated user.
   * @param id - Salesforce commission id.
   * @returns The result of the deletion.
   */
  removeCommission(user: User, id: string) {
    unauthorizedException(!!user, 'Unauthorized');
    required(id, 'id');
    return this.commissionRepository.removeCommission(id);
  }
}
