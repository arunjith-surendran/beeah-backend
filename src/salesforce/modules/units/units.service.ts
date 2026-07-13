import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  GET_UNIT_PREFERENCE_APEX_REST_PATH,
  GET_UNITS_APEX_REST_PATH,
} from '../../network/paths/units.paths';
import {
  GetUnitsApexRawResponse,
  GetUnitsApexResponse,
} from './types/get-units.type';
import {
  GetUnitPreferenceApexPayload,
  GetUnitPreferenceApexResponse,
} from './types/get-unit-preference.type';

@Injectable()
export class UnitsService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `getunits` Apex REST endpoint for a given project and flattens
   * its per-building grouping (`data: [{ units, buildingId }]`) into a single unit list,
   * merging each group's `buildingId` onto every unit within it. When the project has no
   * units, Salesforce instead sends a flat (empty) `units` array with no `data` field -
   * that shape is passed through as-is rather than assuming `data` is always present.
   *
   * @param projectId - Salesforce project id to fetch units for.
   * @returns The project's unit records as a flat list, with buildingId per unit.
   */
  async getUnitsByProject(projectId: string): Promise<GetUnitsApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetUnitsApexRawResponse>(
        GET_UNITS_APEX_REST_PATH,
        { projectId },
      );
    const raw = response.data;

    return {
      status: raw.status,
      noOfUnits: raw.noOfUnits,
      message: raw.message,
      units:
        'data' in raw
          ? raw.data.flatMap((group) =>
              group.units.map((unit) => ({
                ...unit,
                buildingId: group.buildingId,
              })),
            )
          : raw.units.map((unit) => ({ ...unit, buildingId: null })),
    };
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
