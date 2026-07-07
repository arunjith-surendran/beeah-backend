import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import { GET_PROJECT_APEX_REST_PATH } from '../../network/paths/project.paths';
import { GetProjectApexResponse } from './types/get-project.type';

@Injectable()
export class ProjectService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `getProject` Apex REST endpoint.
   *
   * @param projectId - Salesforce project id to filter by. Omit to fetch every project.
   * @returns The raw Apex REST response containing matching project records.
   */
  async getProjectDetails(projectId?: string): Promise<GetProjectApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetProjectApexResponse>(
        GET_PROJECT_APEX_REST_PATH,
        projectId ? { projectId } : {},
      );
    return response.data;
  }
}
