import { Injectable } from '@nestjs/common';
import { SalesforceClient } from '../../network/salesforce.client';
import {
  GET_DOCUMENT_BASE64_APEX_REST_PATH,
  UPLOAD_DOCUMENT_APEX_REST_PATH,
} from '../../network/paths/document.paths';
import {
  UploadDocumentApexPayload,
  UploadDocumentApexResponse,
} from './types/upload-document.type';
import {
  GetDocumentBase64ApexPayload,
  GetDocumentBase64ApexResponse,
} from './types/get-document-base64.type';

@Injectable()
export class DocumentService {
  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Calls the Salesforce `uploadDocument` Apex REST endpoint (POST) to upload a
   * base64-encoded document against a record.
   *
   * @param payload - Document fields in the exact shape expected by the Apex REST endpoint.
   * @returns The raw Apex REST response containing the created document id and Azure URL.
   */
  async uploadDocument(
    payload: UploadDocumentApexPayload,
  ): Promise<UploadDocumentApexResponse> {
    const response =
      await this.salesforceClient.http.post<UploadDocumentApexResponse>(
        UPLOAD_DOCUMENT_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }

  /**
   * Calls the Salesforce `getbase64` Apex REST endpoint (POST) to fetch a
   * previously uploaded document's base64 content, for previewing.
   *
   * @param payload - The target document's id.
   * @returns The raw Apex REST response containing the document's base64 content.
   */
  async getDocumentBase64(
    payload: GetDocumentBase64ApexPayload,
  ): Promise<GetDocumentBase64ApexResponse> {
    const response =
      await this.salesforceClient.http.post<GetDocumentBase64ApexResponse>(
        GET_DOCUMENT_BASE64_APEX_REST_PATH,
        payload,
      );
    return response.data;
  }
}
