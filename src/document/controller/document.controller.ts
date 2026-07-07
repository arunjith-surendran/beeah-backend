import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { DocumentService } from '../service/document.service';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import { UploadDocumentDto } from '../dto/upload-document.dto';
import { UploadDocumentResultDto } from '../dto/upload-document-result.dto';
import { PreviewDocumentResultDto } from '../dto/preview-document-result.dto';

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Uploads a base64-encoded document against a Salesforce record. Common endpoint
   * shared by any flow that needs to attach a document (EOI, onboarding, sales booking, ...).
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param dto - Document fields: file name, base64 content, target record id, and document type.
   * @returns The created document id and Azure URL wrapped in a `{ message, data }` envelope.
   */
  @Post('upload')
  uploadDocument(
    @CurrentUser() user: User,
    @Body() dto: UploadDocumentDto,
  ): Promise<ResultWithMessage<UploadDocumentResultDto>> {
    return this.documentService.uploadDocument(user, dto);
  }

  /**
   * Fetches a previously uploaded document's base64 content, for previewing.
   *
   * @param user - Authenticated user attached by `JwtAuthGuard`.
   * @param documentId - The target document's id.
   * @returns The document's base64 content wrapped in a `{ message, data }` envelope.
   */
  @Get('preview/:documentId')
  previewDocument(
    @CurrentUser() user: User,
    @Param('documentId') documentId: string,
  ): Promise<ResultWithMessage<PreviewDocumentResultDto>> {
    return this.documentService.previewDocument(user, documentId);
  }
}
