import { Injectable } from '@nestjs/common';
import {
  CommissionService as SalesforceCommissionService,
  SalesforceCommission,
} from '../../salesforce/modules/commission/commission.service';

@Injectable()
export class CommissionRepository {
  constructor(
    private readonly salesforceCommissionService: SalesforceCommissionService,
  ) {}

  /**
   * Passes through to the Salesforce commission service.
   *
   * @returns All commissions.
   */
  getAllCommissions(): Promise<SalesforceCommission[]> {
    return this.salesforceCommissionService.getAllCommissions();
  }

  /**
   * Passes through to the Salesforce commission service for a single commission.
   *
   * @param id - Salesforce commission id.
   * @returns The matching commission.
   */
  getCommissionById(id: string): Promise<SalesforceCommission> {
    return this.salesforceCommissionService.getCommissionById(id);
  }

  /**
   * Passes through to the Salesforce commission service to create a commission.
   *
   * @param data - Commission fields in Salesforce field-name shape.
   * @returns The created commission.
   */
  createCommission(data: Partial<SalesforceCommission>) {
    return this.salesforceCommissionService.createCommission(data);
  }

  /**
   * Passes through to the Salesforce commission service to update a commission.
   *
   * @param id - Salesforce commission id.
   * @param data - Commission fields to update, in Salesforce field-name shape.
   * @returns The updated commission.
   */
  updateCommission(id: string, data: Partial<SalesforceCommission>) {
    return this.salesforceCommissionService.updateCommission(id, data);
  }

  /**
   * Passes through to the Salesforce commission service to delete a commission.
   *
   * @param id - Salesforce commission id.
   * @returns The result of the deletion.
   */
  removeCommission(id: string) {
    return this.salesforceCommissionService.removeCommission(id);
  }
}
