/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { UnitsRepository } from '../repository/units.repository';
import { Unit } from '../../salesforce/modules/units/types/get-units.type';
import { GetUnitPreferenceApexResponse } from '../../salesforce/modules/units/types/get-unit-preference.type';
import { ProjectService } from '../../project/service/project.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import {
  notFoundException,
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { UnitDto } from '../dto/get-units.dto';
import { UnitPreferenceListDto } from '../dto/unit-preference-list.dto';

@Injectable()
export class UnitsService {
  constructor(
    private readonly unitsRepository: UnitsRepository,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Fetches every unit for the given project, maps them to `UnitDto`, and returns the requested page.
   *
   * @param user - Authenticated user.
   * @param projectId - Salesforce project id.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @throws {BadRequestException} When `projectId` is missing or blank.
   * @returns The requested page of the project's units, with pagination metadata alongside `message`.
   */
  async getUnitsByProject(
    user: User,
    projectId: string,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<UnitDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(projectId, 'projectId');

    const response = await this.unitsRepository.getUnitsByProject(projectId);
    const paged = paginate(response.units, pageNumber, pageSize);
    const projectImage = await this.getProjectImage(user, projectId);

    return {
      message: response.message,
      pagination: {
        pageNumber: paged.pageNumber,
        pageSize: paged.pageSize,
        total: paged.total,
        totalPages: paged.totalPages,
        hasNext: paged.hasNext,
        hasPrevious: paged.hasPrevious,
      },
      data: paged.items.map((unit) => this.toUnitDto(unit, projectImage)),
    };
  }

  /**
   * Fetches every unit for the given project, filters it down to those whose name or
   * code contains `query`, and returns the requested page of matches.
   *
   * @param user - Authenticated user.
   * @param projectId - Salesforce project id.
   * @param query - Search term matched case-insensitively against the unit name or code.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @throws {BadRequestException} When `projectId` or `query` is missing or blank.
   * @returns The requested page of matching units, with pagination metadata alongside `message`.
   */
  async searchUnitsByProject(
    user: User,
    projectId: string,
    query: string,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<UnitDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(projectId, 'projectId');
    required(query, 'query');

    const response = await this.unitsRepository.getUnitsByProject(projectId);
    const search = query.trim().toLowerCase();

    const matched = response.units.filter(
      (unit) =>
        unit.unitName?.toLowerCase().includes(search) ||
        unit.unitCode?.toLowerCase().includes(search),
    );
    const paged = paginate(matched, pageNumber, pageSize);
    const projectImage = await this.getProjectImage(user, projectId);

    return {
      message: response.message,
      pagination: {
        pageNumber: paged.pageNumber,
        pageSize: paged.pageSize,
        total: paged.total,
        totalPages: paged.totalPages,
        hasNext: paged.hasNext,
        hasPrevious: paged.hasPrevious,
      },
      data: paged.items.map((unit) => this.toUnitDto(unit, projectImage)),
    };
  }

  /**
   * Fetches the parent project's image, to use as a fallback when a unit has none of its
   * own. Never throws - a project lookup failure just means no fallback image is available.
   *
   * @param user - Authenticated user.
   * @param projectId - Salesforce project id.
   * @returns The project's first "Images"-typed document url, or `null` if unavailable.
   */
  private async getProjectImage(
    user: User,
    projectId: string,
  ): Promise<string | null> {
    try {
      const result = await this.projectService.getProjectDetailsById(
        user,
        projectId,
      );
      const project = result.data[0];
      const imageDoc =
        project?.documents.find((doc) => doc.type === 'Images') ??
        project?.documents.find((doc) => !!doc.url);
      return imageDoc?.url ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Best-effort extraction of a unit's own image url from its raw `documents` array. The
   * Salesforce `getunits` response hasn't been observed to reliably populate this, so the
   * shape is unverified - this only trusts entries that clearly carry a url-like string field.
   *
   * @param documents - Raw, untyped unit document list from the Salesforce Apex REST response.
   * @returns The first plausible image url found, or `null`.
   */
  private extractUnitImage(documents: unknown[]): string | null {
    for (const doc of documents) {
      if (doc && typeof doc === 'object') {
        const record = doc as Record<string, unknown>;
        const url = record.documentUrl1 ?? record.url;
        if (typeof url === 'string' && url.length > 0) {
          return url;
        }
      }
    }
    return null;
  }

  /**
   * Maps a raw Salesforce `Unit` record into the API's `UnitDto` shape.
   *
   * @param unit - Raw unit record returned by the Salesforce Apex REST endpoint.
   * @param projectImage - The parent project's image, used when the unit has none of its own.
   * @returns The unit shaped for API consumers, with price coerced to a number.
   */
  private toUnitDto(unit: Unit, projectImage: string | null): UnitDto {
    return {
      id: unit.unitId,
      code: unit.unitCode,
      name: unit.unitName,
      type: unit.unitType,
      view: unit.unitView,
      price: unit.unitPrice !== null ? Number(unit.unitPrice) : null,
      status: unit.status,
      propertyType: unit.propertyType,
      noOfBedroom: unit.noOfBedroom,
      isVilla: unit.isVilla,
      guestRoom: unit.guestRoom,
      floor: unit.floor,
      buildingId: unit.buildingId,
      balconyArea: unit.balconyArea,
      area: unit.area,
      approvalStatus: unit.approvalStatus,
      apartmentType: unit.apartmentType,
      image: this.extractUnitImage(unit.documents) ?? projectImage,
    };
  }

  /**
   * Fetches the unit preference (unit type) options and token amount for a given project.
   *
   * @param user - Authenticated user.
   * @param projectId - Salesforce project id.
   * @throws {BadRequestException} When `projectId` is missing or blank.
   * @returns The token amount and unit preference list wrapped in a `{ message, data }` envelope.
   */
  async getUnitPreferences(
    user: User,
    projectId: string,
  ): Promise<ResultWithMessage<UnitPreferenceListDto>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(projectId, 'projectId');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const response = await this.unitsRepository.getUnitPreferences({
      projectId,
    });

    return {
      message: response.message,
      data: this.toUnitPreferenceListDto(response),
    };
  }

  /**
   * Maps the raw Salesforce unit preference response into the API's `UnitPreferenceListDto` shape.
   *
   * @param response - Raw Apex REST response.
   * @returns The token amount and unit preference list shaped for API consumers.
   */
  private toUnitPreferenceListDto(
    response: GetUnitPreferenceApexResponse,
  ): UnitPreferenceListDto {
    return {
      tokenAmount: response.tokenAmount,
      unitPreferences: response.data,
    };
  }

  /**
   * Fetches a single unit's details by id, within the given project. There's no dedicated
   * Salesforce "get unit by id" endpoint, so this fetches every unit for the project (same
   * repository call as `getUnitsByProject`) and returns the one matching `unitId`.
   *
   * @param user - Authenticated user.
   * @param projectId - Salesforce project id.
   * @param unitId - Salesforce unit id.
   * @throws {BadRequestException} When `projectId` or `unitId` is missing or blank.
   * @throws {NotFoundException} When no unit matches `unitId` within the project.
   * @returns The matching unit, wrapped in a `{ message, data }` envelope.
   */
  async getUnitDetails(
    user: User,
    projectId: string,
    unitId: string,
  ): Promise<ResultWithMessage<UnitDto>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(projectId, 'projectId');
    required(unitId, 'unitId');

    const response = await this.unitsRepository.getUnitsByProject(projectId);
    const unit = response.units.find((item) => item.unitId === unitId);
    notFoundException(unit, `Unit with id ${unitId} not found`);
    const projectImage = await this.getProjectImage(user, projectId);

    return {
      message: response.message,
      data: this.toUnitDto(unit, projectImage),
    };
  }
}
