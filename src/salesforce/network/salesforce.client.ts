/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '../../common/utils/http-errors.util';
import { required } from '../../common/utils/validators.util';
import { extractSalesforceUserId } from '../../common/utils/extract-salesforce-user-id.util';

export interface SalesforceSession {
  accessToken: string;
  instanceUrl: string;
  salesforceUserId: string | null;
  expiresAt: Date;
}

interface SalesforceTokenResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
  issued_at: string;
  signature: string;
  id: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const SALESFORCE_TOKEN_ID = 'salesforce';
const SESSION_TTL_MS = 55 * 60 * 1000;

@Injectable()
export class SalesforceClient {
  readonly http: AxiosInstance;

  private readonly loginUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly apiVersion: string;
  private session: SalesforceSession | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.loginUrl = this.config.getOrThrow<string>('SALESFORCE_LOGIN_URL');
    this.clientId = this.config.getOrThrow<string>('SALESFORCE_CLIENT_ID');
    this.clientSecret = this.config.getOrThrow<string>(
      'SALESFORCE_CLIENT_SECRET',
    );
    this.apiVersion = this.config.get('SALESFORCE_API_VERSION', 'v60.0');

    this.http = axios.create();
    this.http.interceptors.request.use((request) => this.attachAuth(request));
    this.http.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.retryOnUnauthorized(error),
    );
  }

  private async attachAuth(
    request: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> {
    const session = await this.ensureSession();
    request.baseURL = request.url?.startsWith('/services/')
      ? session.instanceUrl
      : `${session.instanceUrl}/services/data/${this.apiVersion}`;
    request.headers.set('Authorization', `Bearer ${session.accessToken}`);
    return request;
  }

  private async retryOnUnauthorized(error: AxiosError) {
    const request = error.config as RetryableRequestConfig | undefined;

    if (error.response?.status === 401 && request && !request._retry) {
      request._retry = true;
      await this.login();
      return this.http.request(request);
    }

    return Promise.reject(this.toApiError(error));
  }

  /**
   * Maps a Salesforce API error to the NestJS HTTP exception matching its actual status
   * code, so callers see the real error (404, 400, ...) instead of a blanket 502 for
   * everything. Falls back to `BadGatewayException` for anything that isn't a recognized
   * 4xx (network failure, 5xx, timeout, etc.) since those genuinely are "upstream is down."
   */
  private toApiError(error: AxiosError) {
    const context = 'Salesforce API error';
    const status = error.response?.status;
    const detail = `${context} (${status}): ${JSON.stringify(error.response?.data)}`;

    switch (status) {
      case 400:
        return new BadRequestException(detail);
      case 401:
        return new UnauthorizedException(detail);
      case 403:
        return new ForbiddenException(detail);
      case 404:
        return new NotFoundException(detail);
      default:
        return new BadGatewayException(detail);
    }
  }

  async authenticate(): Promise<SalesforceSession> {
    return this.ensureSession();
  }

  /**
   * Returns the Salesforce user id our client-credentials grant authenticates as - the
   * same identity for every request, parsed once from the OAuth token's `id` field and
   * cached in `SalesforceToken`. Use this instead of accepting a `userId` from the client,
   * since this integration always runs as a single fixed Salesforce user.
   *
   * @returns The Salesforce user id.
   */
  async getUserId(): Promise<string> {
    const session = await this.ensureSession();
    required(session.salesforceUserId, 'Salesforce user id');
    return session.salesforceUserId;
  }

  private async ensureSession(): Promise<SalesforceSession> {
    if (this.session && Date.now() < this.session.expiresAt.getTime()) {
      return this.session;
    }

    const stored = await this.prisma.salesforceToken.findUnique({
      where: { id: SALESFORCE_TOKEN_ID },
    });

    if (stored && Date.now() < stored.expiresAt.getTime()) {
      this.session = stored;
      return this.session;
    }

    return this.login();
  }

  private async login(): Promise<SalesforceSession> {
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    try {
      const response = await axios.post<SalesforceTokenResponse>(
        `${this.loginUrl}/services/oauth2/token`,
        body,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      const salesforceUserId = extractSalesforceUserId(response.data.id);

      const stored = await this.prisma.salesforceToken.upsert({
        where: { id: SALESFORCE_TOKEN_ID },
        create: {
          id: SALESFORCE_TOKEN_ID,
          accessToken: response.data.access_token,
          instanceUrl: response.data.instance_url,
          salesforceUserId,
          expiresAt,
        },
        update: {
          accessToken: response.data.access_token,
          instanceUrl: response.data.instance_url,
          salesforceUserId,
          expiresAt,
        },
      });

      this.session = stored;
      return stored;
    } catch (error) {
      throw this.toAuthFailure(error);
    }
  }

  /**
   * Wraps an OAuth login failure as `BadGatewayException` regardless of the status
   * Salesforce returned - a broken client-credentials handshake is always an upstream/infra
   * problem on our side, not a per-resource 4xx to surface differently to callers.
   */
  private toAuthFailure(error: unknown): BadGatewayException {
    const context = 'Salesforce authentication failed';
    if (axios.isAxiosError(error)) {
      return new BadGatewayException(
        `${context} (${error.response?.status}): ${JSON.stringify(error.response?.data)}`,
      );
    }
    return new BadGatewayException(context);
  }
}
