export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  pageNumber?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  data: T;
}
