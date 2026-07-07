import { Injectable } from '@nestjs/common';
import { DocumentService as SalesforceDocumentService } from '../../salesforce/modules/document/document.service';
import {
  UploadDocumentApexPayload,
  UploadDocumentApexResponse,
} from '../../salesforce/modules/document/types/upload-document.type';
import {
  GetDocumentBase64ApexPayload,
  GetDocumentBase64ApexResponse,
} from '../../salesforce/modules/document/types/get-document-base64.type';

@Injectable()
export class DocumentRepository {
  constructor(
    private readonly salesforceDocumentService: SalesforceDocumentService,
  ) {}

  /**
   * Passes through to the Salesforce `uploadDocument` Apex REST endpoint.
   *
   * @param payload - Document fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response.
   */
  uploadDocument(
    payload: UploadDocumentApexPayload,
  ): Promise<UploadDocumentApexResponse> {
    return this.salesforceDocumentService.uploadDocument(payload);
  }

  /**
   * Passes through to the Salesforce `getbase64` Apex REST endpoint.
   *
   * @param payload - The target document's id.
   * @returns The raw Apex REST response.
   */
  getDocumentBase64(
    payload: GetDocumentBase64ApexPayload,
  ): Promise<GetDocumentBase64ApexResponse> {
    return this.salesforceDocumentService.getDocumentBase64(payload);
  }
}
