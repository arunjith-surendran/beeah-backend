import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CommissionService } from '../service/commission.service';
import { CreateCommissionDto } from '../dto/create-commission.dto';
import { UpdateCommissionDto } from '../dto/update-commission.dto';

@UseGuards(JwtAuthGuard)
@Controller('commissions')
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  /**
   * Fetches every commission record, paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of commissions.
   */
  @Get()
  getAllCommissions(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.commissionService.getAllCommissions(user, pageNumber, pageSize);
  }

  /**
   * Fetches a single commission by id.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce commission id, taken from the route path.
   * @returns The matching commission.
   */
  @Get(':id')
  getCommissionById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.commissionService.getCommissionById(user, id);
  }

  /**
   * Creates a new commission.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - New commission's details.
   * @returns The created commission.
   */
  @Post()
  createCommission(
    @CurrentUser() user: User,
    @Body() dto: CreateCommissionDto,
  ) {
    return this.commissionService.createCommission(user, dto);
  }

  /**
   * Updates an existing commission.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce commission id, taken from the route path.
   * @param dto - Fields to update on the commission.
   * @returns The updated commission.
   */
  @Patch(':id')
  updateCommission(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() dto: UpdateCommissionDto,
  ) {
    return this.commissionService.updateCommission(user, id, dto);
  }

  /**
   * Deletes a commission by id.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param id - Salesforce commission id, taken from the route path.
   * @returns The result of the deletion.
   */
  @Delete(':id')
  removeCommission(@CurrentUser() user: User, @Param('id') id: string) {
    return this.commissionService.removeCommission(user, id);
  }
}
