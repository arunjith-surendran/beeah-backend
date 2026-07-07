import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ResultWithMessage } from '../interfaces/result-with-message.interface';
import { PaginatedResultWithMessage } from '../interfaces/paginated-result-with-message.interface';

const DEFAULT_SUCCESS_MESSAGE = 'Request successful';

function isResultWithMessage(
  result: unknown,
): result is ResultWithMessage<unknown> {
  return (
    !!result &&
    typeof result === 'object' &&
    'message' in result &&
    'data' in result &&
    typeof (result as { message: unknown }).message === 'string'
  );
}

function isPaginatedResultWithMessage(
  result: unknown,
): result is PaginatedResultWithMessage<unknown> {
  return (
    isResultWithMessage(result) &&
    'pagination' in result &&
    typeof (result as { pagination: unknown }).pagination === 'object'
  );
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result) => {
        if (isPaginatedResultWithMessage(result)) {
          return {
            success: true,
            statusCode: response.statusCode,
            message: result.message,
            ...result.pagination,
            data: result.data as T,
          };
        }

        const wrapped = isResultWithMessage(result);

        return {
          success: true,
          statusCode: response.statusCode,
          message: wrapped ? result.message : DEFAULT_SUCCESS_MESSAGE,
          data: (wrapped ? result.data : result) as T,
        };
      }),
    );
  }
}
