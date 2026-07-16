import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BadGatewayException } from '../../common/utils/http-errors.util';

export interface NgeniusOrderAmount {
  currencyCode: string;
  // Minor units - e.g. 10050 = 100.50 AED.
  value: number;
}

export interface NgeniusCreateOrderRequest {
  action: 'SALE' | 'AUTH';
  amount: NgeniusOrderAmount;
  merchantOrderReference: string;
  merchantAttributes: {
    redirectUrl: string;
    skipConfirmationPage?: boolean;
  };
}

export interface NgeniusOrderPaymentEmbed {
  reference: string;
  // The order's actual payment state (e.g. STARTED, CAPTURED, FAILED) lives
  // here, not on the order object itself - confirmed against the live
  // sandbox API, not assumed from docs.
  state: string;
}

export interface NgeniusOrderResponse {
  reference: string;
  _links: {
    payment?: { href: string };
    [key: string]: { href: string } | undefined;
  };
  _embedded?: {
    payment?: NgeniusOrderPaymentEmbed[];
  };
}

interface NgeniusAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const TOKEN_MEDIA_TYPE = 'application/vnd.ni-identity.v1+json';
const ORDER_MEDIA_TYPE = 'application/vnd.ni-payment.v2+json';
// Refresh a little before actual expiry to avoid racing a request against it.
const EXPIRY_SAFETY_MARGIN_MS = 30 * 1000;

/**
 * Thin HTTP client for N-Genius (Network International) Order API - handles
 * the access-token handshake (cached in memory until it's close to expiry)
 * and the two calls the EOI payment flow needs: create an order (returns the
 * hosted payment page URL) and check an order's status afterwards.
 */
@Injectable()
export class NgeniusClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly outletId: string;
  private readonly realm: string;

  private accessToken: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.getOrThrow<string>('NGENIUS_BASE_URL');
    this.apiKey = this.config.getOrThrow<string>('NGENIUS_API_KEY');
    this.outletId = this.config.getOrThrow<string>('NGENIUS_OUTLET_ID');
    this.realm = this.config.get('NGENIUS_REALM', 'ni');
  }

  async createOrder(
    request: NgeniusCreateOrderRequest,
  ): Promise<NgeniusOrderResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.post<NgeniusOrderResponse>(
        `${this.baseUrl}/transactions/outlets/${this.outletId}/orders`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': ORDER_MEDIA_TYPE,
            Accept: ORDER_MEDIA_TYPE,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.toApiError(error, 'Failed to create N-Genius order');
    }
  }

  async getOrder(orderReference: string): Promise<NgeniusOrderResponse> {
    const token = await this.getAccessToken();

    try {
      const response = await axios.get<NgeniusOrderResponse>(
        `${this.baseUrl}/transactions/outlets/${this.outletId}/orders/${orderReference}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: ORDER_MEDIA_TYPE,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw this.toApiError(error, 'Failed to fetch N-Genius order status');
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }

    try {
      const response = await axios.post<NgeniusAccessTokenResponse>(
        `${this.baseUrl}/identity/auth/access-token`,
        { realm: this.realm },
        {
          headers: {
            Authorization: `Basic ${this.apiKey}`,
            'Content-Type': TOKEN_MEDIA_TYPE,
            Accept: TOKEN_MEDIA_TYPE,
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt =
        Date.now() + response.data.expires_in * 1000 - EXPIRY_SAFETY_MARGIN_MS;
      return this.accessToken;
    } catch (error) {
      throw this.toApiError(error, 'N-Genius authentication failed');
    }
  }

  private toApiError(error: unknown, context: string): BadGatewayException {
    if (axios.isAxiosError(error)) {
      return new BadGatewayException(
        `${context} (${error.response?.status}): ${JSON.stringify(error.response?.data)}`,
      );
    }
    return new BadGatewayException(context);
  }
}
