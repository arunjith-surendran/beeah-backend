import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { DocumentService } from './document.service';

@Module({
  imports: [SalesforceModule],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
