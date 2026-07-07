import { Module } from '@nestjs/common';
import { SalesforceClient } from './network/salesforce.client';

@Module({
  providers: [SalesforceClient],
  exports: [SalesforceClient],
})
export class SalesforceModule {}
