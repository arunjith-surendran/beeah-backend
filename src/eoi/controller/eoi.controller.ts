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
import { EoiService } from '../service/eoi.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { PaginatedResultWithMessage } from '../../common/interfaces/paginated-result-with-message.interface';
import { EoiDetailDto } from '../dto/get-eois.dto';
import { CreateModeOfPaymentDto } from '../dto/create-mode-of-payment.dto';
import { CreateModeOfPaymentResultDto } from '../dto/create-mode-of-payment-result.dto';
import { CreateEoiDto } from '../dto/create-eoi.dto';
import { CreateEoiResultDto } from '../dto/create-eoi-result.dto';

@UseGuards(JwtAuthGuard)
@Controller('eoi')
export class EoiController {
  constructor(private readonly eoiService: EoiService) {}

  /**
   * Creates a new EOI, including buyer/company/representative info and unit preferences.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - New EOI's details.
   * @returns The created record/lead/account ids wrapped in a `{ message, data }` envelope.
   */
  @Post('create-eoi')
  createEoi(
    @CurrentUser() user: User,
    @Body() dto: CreateEoiDto,
  ): Promise<ResultWithMessage<CreateEoiResultDto>> {
    return this.eoiService.createEoi(user, dto);
  }

  /**
   * Fetches every EOI owned by the Salesforce user our client-credentials grant
   * authenticates as, paginated on our side.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param pageNumber - 1-based page number. Defaults to 1.
   * @param pageSize - Page size. Defaults to 10.
   * @returns The requested page of the user's EOIs, with pagination metadata alongside `message`.
   */
  @Get('get-all')
  getEoisByUser(
    @CurrentUser() user: User,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<PaginatedResultWithMessage<EoiDetailDto[]>> {
    return this.eoiService.getEoisByUser(user, pageNumber, pageSize);
  }

  /**
   * Records one or more mode-of-payment entries against an EOI.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param eoiId - Salesforce EOI id, taken from the route path.
   * @param dto - Mode-of-payment entries submitted by the client.
   * @returns The created record id wrapped in a `{ message, data }` envelope.
   */
  @Post('mode-of-payment/:eoiId')
  createModeOfPayment(
    @CurrentUser() user: User,
    @Param('eoiId') eoiId: string,
    @Body() dto: CreateModeOfPaymentDto,
  ): Promise<ResultWithMessage<CreateModeOfPaymentResultDto>> {
    return this.eoiService.createModeOfPayment(user, eoiId, dto);
  }
}
