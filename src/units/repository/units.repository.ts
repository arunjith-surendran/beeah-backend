import { Injectable } from '@nestjs/common';
import { UnitsService as SalesforceUnitsService } from '../../salesforce/modules/units/units.service';
import { GetUnitsApexResponse } from '../../salesforce/modules/units/types/get-units.type';
import {
  GetUnitPreferenceApexPayload,
  GetUnitPreferenceApexResponse,
} from '../../salesforce/modules/units/types/get-unit-preference.type';

@Injectable()
export class UnitsRepository {
  constructor(
    private readonly salesforceUnitsService: SalesforceUnitsService,
  ) {}

  /**
   * Passes through to the Salesforce units service for a given project.
   *
   * @param projectId - Salesforce project id to fetch units for.
   * @returns The raw Salesforce Apex REST response.
   */
  getUnitsByProject(projectId: string): Promise<GetUnitsApexResponse> {
    return this.salesforceUnitsService.getUnitsByProject(projectId);
  }

  /**
   * Passes through to the Salesforce `getunitperference` Apex REST endpoint.
   *
   * @param payload - The target project's id.
   * @returns The raw Apex REST response.
   */
  getUnitPreferences(
    payload: GetUnitPreferenceApexPayload,
  ): Promise<GetUnitPreferenceApexResponse> {
    return this.salesforceUnitsService.getUnitPreferences(payload);
  }
}
