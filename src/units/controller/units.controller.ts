/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UnitsService } from '../service/units.service';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { UnitDto } from '../dto/get-units.dto';
import { UnitPreferenceListDto } from '../dto/unit-preference-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  /**
   * Fetches every unit belonging to the given project, paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the project's units, with pagination metadata alongside `message`.
   */
  @Get('get-all/:projectId')
  getUnitsByProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<UnitDto[]>> {
    return this.unitsService.getUnitsByProject(
      user,
      projectId,
      pageNumber,
      pageSize,
    );
  }

  /**
   * Searches units within a project whose name or code contains the given text
   * (case-insensitive), paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @param query - Search term matched against the unit name or code.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of matching units, with pagination metadata alongside `message`.
   */
  @Get('search/:projectId')
  searchUnitsByProject(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @Query('query') query: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<UnitDto[]>> {
    return this.unitsService.searchUnitsByProject(
      user,
      projectId,
      query,
      pageNumber,
      pageSize,
    );
  }

  /**
   * Fetches the unit preference (unit type) options and token amount for a given project.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @returns The token amount and unit preference list wrapped in a `{ message, data }` envelope.
   */
  @Get('preferences-get-all/:projectId')
  getUnitPreferences(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
  ): Promise<ResultWithMessage<UnitPreferenceListDto>> {
    return this.unitsService.getUnitPreferences(user, projectId);
  }

  /**
   * Fetches a single unit's details by id, within the given project. There's no dedicated
   * Salesforce "get unit by id" endpoint, so this fetches every unit for the project (same as
   * `get-all/:projectId`) and returns the one matching `unitId`.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @param unitId - Salesforce unit id, taken from the route path.
   * @returns The matching unit, wrapped in a `{ message, data }` envelope.
   */
  @Get('unit-details/:projectId/:unitId')
  getUnitDetails(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @Param('unitId') unitId: string,
  ): Promise<ResultWithMessage<UnitDto>> {
    return this.unitsService.getUnitDetails(user, projectId, unitId);
  }
}
