export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginatedResult<T> extends PaginationMeta {
  items: T[];
}
