import { Injectable, Logger } from '@nestjs/common';
import { SalesforceClient } from '../../salesforce/network/salesforce.client';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private readonly salesforceClient: SalesforceClient) {}

  /**
   * Authenticates against Salesforce and returns the access token so it can be surfaced to the client.
   * Failures are logged and swallowed since this is best-effort, not a login requirement -
   * callers get `undefined` back instead of the request failing.
   *
   * @returns The Salesforce access token, or `undefined` if authentication failed.
   */
  async warmSalesforceSession(): Promise<string | undefined> {
    try {
      const session = await this.salesforceClient.authenticate();
      return session.accessToken;
    } catch (error) {
      this.logger.warn(
        `Salesforce session warm-up failed: ${(error as Error).message}`,
      );
      return undefined;
    }
  }
}
