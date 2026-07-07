import { PaginatedResult } from '../interfaces/paginated-result.interface';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Slices an already-fetched, in-memory array into a page. Use this for any list that's
 * fully loaded up front (e.g. a Salesforce endpoint with no server-side pagination) and
 * needs to be paginated on our side before it reaches the client.
 *
 * @param items - Full list to paginate.
 * @param pageNumber - 1-based page number, as a raw query string or number. Falls back to 1 if missing/invalid.
 * @param pageSize - Page size, as a raw query string or number. Falls back to 10 if missing/invalid.
 * @returns The requested page of items plus pagination metadata.
 */
export function paginate<T>(
  items: T[],
  pageNumber?: string | number,
  pageSize?: string | number,
): PaginatedResult<T> {
  const page = Math.max(
    1,
    Math.trunc(Number(pageNumber)) || DEFAULT_PAGE_NUMBER,
  );
  const size = Math.max(1, Math.trunc(Number(pageSize)) || DEFAULT_PAGE_SIZE);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const start = (page - 1) * size;

  return {
    items: items.slice(start, start + size),
    pageNumber: page,
    pageSize: size,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
