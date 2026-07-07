import { Module } from '@nestjs/common';
import { DocumentModule as SalesforceDocumentModule } from '../salesforce/modules/document/document.module';
import { DocumentController } from './controller/document.controller';
import { DocumentService } from './service/document.service';
import { DocumentRepository } from './repository/document.repository';

@Module({
  imports: [SalesforceDocumentModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
})
export class DocumentModule {}
