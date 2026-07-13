import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
   * Creates a new Salesforce lead. The interested project is optional, matching the
   * real Salesforce broker portal's lead-creation form.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - Lead details submitted by the client.
   * @returns The created lead id wrapped in a `{ message, data }` envelope.
   */
  @Post('create-lead')
  createLead(
    @CurrentUser() user: User,
    @Body() dto: CreateLeadDto,
  ): Promise<ResultWithMessage<CreateLeadResponseDto>> {
    return this.leadService.createLead(user, dto);
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

  /**
   * Searches leads owned by the Salesforce user our client-credentials grant
   * authenticates as, matching `query` against id/name/email/mobile phone, paginated
   * on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param query - Search term matched against the lead's id, name, email, or mobile phone.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of matching leads wrapped in a `{ message, data }` envelope.
   */
  @Get('search')
  searchLeadsByUser(
    @CurrentUser() user: User,
    @Query('query') query: string,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<LeadDetailDto[]>> {
    return this.leadService.searchLeadsByUser(
      user,
      query,
      pageNumber,
      pageSize,
    );
  }
}
