import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { LeadService } from '../service/lead.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { CreateLeadDto, CreateLeadResponseDto } from '../dto/create-lead.dto';
import { LeadDetailDto } from '../dto/get-leads.dto';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  /**
   * Creates a new Salesforce lead for the given project.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param projectId - Salesforce project id, taken from the route path.
   * @param dto - Lead details submitted by the client.
   * @returns The created lead id wrapped in a `{ message, data }` envelope.
   */
  @Post('create-lead/:projectId')
  createLead(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
    @Body() dto: CreateLeadDto,
  ): Promise<ResultWithMessage<CreateLeadResponseDto>> {
    return this.leadService.createLead(user, projectId, dto);
  }

  /**
   * Fetches every lead owned by the Salesforce user our client-credentials grant
   * authenticates as, paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's leads wrapped in a `{ message, data }` envelope.
   */
  @Get('get-all')
  getLeadsByUser(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<LeadDetailDto[]>> {
    return this.leadService.getLeadsByUser(user, pageNumber, pageSize);
  }
}
