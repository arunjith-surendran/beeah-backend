import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  GET_UNIT_PREFERENCE_APEX_REST_PATH,
  GET_UNITS_APEX_REST_PATH,
} from '../../network/paths/units.paths';
import { GetUnitsApexResponse } from './types/get-units.type';
import {
  GetUnitPreferenceApexPayload,
  GetUnitPreferenceApexResponse,
} from './types/get-unit-preference.type';

@Injectable()
export class UnitsService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `getunits` Apex REST endpoint for a given project.
   *
   * @param projectId - Salesforce project id to fetch units for.
   * @returns The raw Apex REST response containing the project's unit records.
   */
  async getUnitsByProject(projectId: string): Promise<GetUnitsApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetUnitsApexResponse>(
        GET_UNITS_APEX_REST_PATH,
        { projectId },
      );
    return response.data;
  }

  /**
   * Calls the Salesforce `getunitperference` Apex REST endpoint (POST) to fetch the
   * unit preference (unit type) options and token amount for a given project.
   *
   * @param payload - The target project's id.
   * @returns The raw Apex REST response containing the token amount and unit preference list.
   */
  async getUnitPreferences(
    payload: GetUnitPreferenceApexPayload,
  ): Promise<GetUnitPreferenceApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetUnitPreferenceApexResponse>(
        GET_UNIT_PREFERENCE_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
