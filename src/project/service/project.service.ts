import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { ProjectRepository } from '../repository/project.repository';
import { ProjectDetail } from '../../salesforce/modules/project/types/get-project.type';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { paginate } from '../../common/utils/paginate.util';
import {
  required,
  notFoundExceptionList,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { ProjectDetailDto, ProjectDocumentDto } from '../dto/get-project.dto';

/**
 * Splits a Salesforce semicolon/newline-delimited string field into a clean array.
 *
 * @param value - Raw delimited string from Salesforce, or `null`.
 * @returns Trimmed, non-empty items, or an empty array when `value` is `null`.
 */
function toList(value: string | null): string[] {
  return value
    ? value
        .split(/;|\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  /**
   * Fetches every project record from Salesforce, maps them to `ProjectDetailDto`, and
   * returns the requested page.
   *
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of projects, with pagination metadata alongside `message`.
   */
  async getAllProjects(
    user: User,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');

    const response = await this.projectRepository.getProjectDetails();
    const paged = paginate(response.projectDetails, pageNumber, pageSize);

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
      data: paged.items.map((project) => this.toProjectDetailDto(project)),
    };
  }

  /**
   * Fetches every project, filters it down to those whose name contains `name`, and
   * returns the requested page of matches.
   *
   * @param name - Search term matched case-insensitively against the project name.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @throws {BadRequestException} When `name` is missing or blank.
   * @returns The requested page of matching projects, with pagination metadata alongside `message`.
   */
  async searchProjectsByName(
    user: User,
    name: string,
    pageNumber?: string,
    pageSize?: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(name, 'name query parameter');

    const response = await this.projectRepository.getProjectDetails();
    const query = name.trim().toLowerCase();

    const matched = response.projectDetails.filter((project) =>
      project.projectName.toLowerCase().includes(query),
    );
    const paged = paginate(matched, pageNumber, pageSize);

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
      data: paged.items.map((project) => this.toProjectDetailDto(project)),
    };
  }

  /**
   * Fetches a single project by id, filtered server-side by Salesforce.
   *
   * @param projectId - Salesforce project id.
   * @throws {BadRequestException} When `projectId` is missing or blank.
   * @throws {NotFoundException} When no project matches `projectId`.
   * @returns The matching project(s), with pagination metadata alongside `message`.
   */
  async getProjectDetailsById(
    user: User,
    projectId: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(projectId, 'projectId');

    const response = await this.projectRepository.getProjectDetails(projectId);
    notFoundExceptionList(
      response.projectDetails,
      `Project with id ${projectId} not found`,
    );

    return {
      message: response.message,
      pagination: {
        pageNumber: 1,
        pageSize: response.totalRecords,
        total: response.totalRecords,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      data: response.projectDetails.map((project) =>
        this.toProjectDetailDto(project),
      ),
    };
  }

  /**
   * Maps a raw Salesforce `ProjectDetail` record into the API's `ProjectDetailDto` shape.
   *
   * @param project - Raw project record returned by the Salesforce Apex REST endpoint.
   * @returns The project shaped for API consumers.
   */
  private toProjectDetailDto(project: ProjectDetail): ProjectDetailDto {
    return {
      id: project.projectId,
      code: project.projectCode,
      name: project.projectName,
      nameArabic: project.projectNameArabic,
      propertyType: toList(project.propertyType),
      propertyStatus: project.propertyStatus,
      startingPrice: project.startingPrice,
      startingArea: project.startingArea,
      reraNumber: project.reraProjectNo,
      reraName: project.reraProjectName,
      postalCode: project.postalCode,
      oneLiner: project.marketingOneLiner,
      description: project.marketingLongDescription,
      amenities: toList(project.amenities),
      documents: project.marketingDocumentList.map(
        (doc): ProjectDocumentDto => ({
          id: doc.documentId,
          type: doc.documentType,
          name: doc.documentName,
          url: doc.documentUrl1,
          secondaryUrl: doc.documentUrl2,
          ownerId: doc.ownerId,
          ownerName: doc.ownerName,
          createdDate: doc.createdDate,
        }),
      ),
      googleMapsLocation: project.googleMapsLocation,
      entityName: project.entityName,
      createdDate: project.createdDate,
      country: project.country,
      city: project.city,
      anticipatedHandoverDate: project.anticipatedHandoverDate,
      anticipatedCompletionDate: project.anticipatedCompletionDate,
      addressLine1: project.addressLine1,
      addressLine2: project.addressLine2,
      actualConstructionStartDate: project.actualConstructionStartDate,
    };
  }
}
