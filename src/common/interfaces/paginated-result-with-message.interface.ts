import { PaginationMeta } from './paginated-result.interface';

/**
 * Return shape for services backing a paginated list endpoint. `ResponseInterceptor`
 * recognizes this shape (via the `pagination` field) and hoists `pagination`'s fields
 * to the top level of the API response, alongside `success`/`statusCode`/`message`,
 * so `data` holds only the list itself.
 */
export interface PaginatedResultWithMessage<T> {
  message: string;
  pagination: PaginationMeta;
  data: T;
}
