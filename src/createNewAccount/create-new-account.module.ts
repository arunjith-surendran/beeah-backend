import { Module } from '@nestjs/common';
import { CreateNewAccountModule as SalesforceCreateNewAccountModule } from '../salesforce/modules/createNewAccount/create-new-account.module';
import { DocumentModule as SalesforceDocumentModule } from '../salesforce/modules/document/document.module';
import { CreateNewAccountController } from './controller/create-new-account.controller';
import { CreateNewAccountService } from './service/create-new-account.service';
import { CreateNewAccountRepository } from './repository/create-new-account.repository';

@Module({
  imports: [SalesforceCreateNewAccountModule, SalesforceDocumentModule],
  controllers: [CreateNewAccountController],
  providers: [CreateNewAccountService, CreateNewAccountRepository],
  exports: [CreateNewAccountService],
})
export class CreateNewAccountModule {}
