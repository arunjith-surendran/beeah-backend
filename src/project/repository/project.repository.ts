import { Injectable } from '@nestjs/common';
import { ProjectService as SalesforceProjectService } from '../../salesforce/modules/project/project.service';
import { GetProjectApexResponse } from '../../salesforce/modules/project/types/get-project.type';
import { TtlCache } from '../../common/utils/ttl-cache';

const PROJECT_LIST_CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable()
export class ProjectRepository {
  private readonly projectListCache = new TtlCache<GetProjectApexResponse>(
    PROJECT_LIST_CACHE_TTL_MS,
  );

  constructor(
    private readonly salesforceProjectService: SalesforceProjectService,
  ) {}

  /**
   * Passes through to the Salesforce project service, optionally scoped to a single project.
   * The full list (no `projectId`) is cached for `PROJECT_LIST_CACHE_TTL_MS` since Salesforce
   * has no server-side pagination and callers (list + search) re-fetch it on every page.
   *
   * @param projectId - Salesforce project id to filter by. Omit to fetch every project.
   * @returns The raw Salesforce Apex REST response.
   */
  async getProjectDetails(projectId?: string): Promise<GetProjectApexResponse> {
    if (projectId) {
      return this.salesforceProjectService.getProjectDetails(projectId);
    }

    const cached = this.projectListCache.get();
    if (cached) {
      return cached;
    }

    const response = await this.salesforceProjectService.getProjectDetails();
    this.projectListCache.set(response);

    return response;
  }
}
