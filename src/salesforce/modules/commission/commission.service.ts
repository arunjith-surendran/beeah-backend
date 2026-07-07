import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  COMMISSION_FIELDS,
  COMMISSION_SOBJECT,
  commissionPath,
} from '../../network/paths/commission.paths';

export interface SalesforceCommission {
  Id: string;
  Name?: string;
  Amount__c?: number;
  Status__c?: string;
  Booking__c?: string;
  [key: string]: unknown;
}

interface SalesforceQueryResult<T> {
  totalSize: number;
  done: boolean;
  records: T[];
}

@Injectable()
export class CommissionService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  async getAllCommissions(limit = 50): Promise<SalesforceCommission[]> {
    const response = await this.salesforceClient.http.get<
      SalesforceQueryResult<SalesforceCommission>
    >('/query', {
      params: {
        q: `SELECT ${COMMISSION_FIELDS.join(', ')} FROM ${COMMISSION_SOBJECT} LIMIT ${limit}`,
      },
    });
    return response.data.records;
  }

  async getCommissionById(id: string): Promise<SalesforceCommission> {
    const response = await this.salesforceClient.http.get<SalesforceCommission>(
      commissionPath(id),
    );
    return response.data;
  }

  async createCommission(data: Partial<SalesforceCommission>) {
    const response = await this.salesforceClient.http.post<{
      id: string;
      success: boolean;
    }>(commissionPath(), data);
    return response.data;
  }

  async updateCommission(id: string, data: Partial<SalesforceCommission>) {
    await this.salesforceClient.http.patch(commissionPath(id), data);
  }

  async removeCommission(id: string) {
    await this.salesforceClient.http.delete(commissionPath(id));
  }
}
