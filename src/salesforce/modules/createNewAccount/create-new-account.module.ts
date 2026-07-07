import { Module } from '@nestjs/common';
import { SalesforceModule } from '../../salesforce.module';
import { CreateNewAccountService } from './create-new-account.service';

@Module({
  imports: [SalesforceModule],
  providers: [CreateNewAccountService],
  exports: [CreateNewAccountService],
})
export class CreateNewAccountModule {}
