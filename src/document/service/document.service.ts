/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { DocumentRepository } from '../repository/document.repository';
import { UploadDocumentApexPayload } from '../../salesforce/modules/document/types/upload-document.type';
import { UploadDocumentDto } from '../dto/upload-document.dto';
import { UploadDocumentResultDto } from '../dto/upload-document-result.dto';
import { PreviewDocumentResultDto } from '../dto/preview-document-result.dto';
import { ResultWithMessage } from '../../common/interfaces/result-with-message.interface';
import {
  required,
  unauthorizedException,
} from '../../common/utils/validators.util';
import { BadRequestException } from '../../common/utils/http-errors.util';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  /**
   * Uploads a base64-encoded document against a Salesforce record via the shared
   * `uploadDocument` Apex REST endpoint. Reusable across any flow that needs to
   * attach a document (EOI, onboarding, sales booking, ...).
   *
   * @param user - Authenticated user.
   * @param dto - Document fields: file name, base64 content, target record id, and document type.
   * @returns The created document id and Azure URL wrapped in a `{ message, data }` envelope.
   */
  async uploadDocument(
    user: User,
    dto: UploadDocumentDto,
  ): Promise<ResultWithMessage<UploadDocumentResultDto>> {
    unauthorizedException(!!user, 'Unauthorized');

    const payload: UploadDocumentApexPayload = {
      fileName: dto.fileName,
      base64: dto.base64,
      recordId: dto.recordId,
      documentType: dto.documentType,
    };
    const response = await this.documentRepository.uploadDocument(payload);

    if (!response.result.success) {
      throw new BadRequestException(
        response.result.errorMessage ?? response.message,
      );
    }

    return {
      message: response.message,
      data: {
        documentId: response.result.documentId,
        azureUrl: response.result.azureUrl,
      },
    };
  }

  /**
   * Fetches a previously uploaded document's base64 content via the shared
   * `getbase64` Apex REST endpoint, for previewing.
   *
   * @param user - Authenticated user.
   * @param documentId - The target document's id.
   * @returns The document's base64 content wrapped in a `{ message, data }` envelope.
   */
  async previewDocument(
    user: User,
    documentId: string,
  ): Promise<ResultWithMessage<PreviewDocumentResultDto>> {
    unauthorizedException(!!user, 'Unauthorized');
    required(documentId, 'Document id');

    const response = await this.documentRepository.getDocumentBase64({
      documentId,
    });
    const message = 'Document fetched successfully';

    return {
      message,
      data: {
        statusCode: 200,
        result: { base64: response.base64 },
        message,
      },
    };
  }
}
