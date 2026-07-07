import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ProjectService } from '../service/project.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { ProjectDetailDto } from '../dto/get-project.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Fetches every project record available in Salesforce, paginated on our side since
   * Salesforce always returns the full list in one call.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of projects, with pagination metadata alongside `message`.
   */
  @Get('all-projects')
  getAllProjects(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    return this.projectService.getAllProjects(user, pageNumber, pageSize);
  }

  /**
   * Searches projects whose name contains the given text (case-insensitive), paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param name - Search term matched against the project name.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of matching projects, with pagination metadata alongside `message`.
   */
  @Get('search-by-name')
  searchProjectsByName(
    @CurrentUser() user: User,
    @Query('name') name: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    return this.projectService.searchProjectsByName(
      user,
      name,
      pageNumber,
      pageSize,
    );
  }

  /**
   * Fetches a single project by its Salesforce project id.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @returns The matching project, with pagination metadata alongside `message`.
   */
  @Get('project-details/:projectId')
  getProjectDetailsById(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
  ): Promise<PaginatedResultWithMessage<ProjectDetailDto[]>> {
    return this.projectService.getProjectDetailsById(user, projectId);
  }
}
