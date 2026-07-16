import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { redactForLogging } from '../utils/redact-for-logging.util';

/**
 * Global interceptor that console-logs every API request and its response -
 * method, URL, params/query/body going in, status/duration/payload coming
 * out - so any endpoint's traffic can be inspected from the server console
 * without attaching a debugger. Registered before `ResponseInterceptor` in
 * `main.ts` so the logged response is the final `{ success, data, ... }`
 * envelope clients actually receive.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl, params, query } = request;
    const body: unknown = request.body;
    const startedAt = Date.now();

    this.logger.log(
      `--> ${method} ${originalUrl} ${JSON.stringify({
        params,
        query,
        body: redactForLogging(body),
      })}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const durationMs = Date.now() - startedAt;
          this.logger.log(
            `<-- ${method} ${originalUrl} ${response.statusCode} +${durationMs}ms ${JSON.stringify(
              redactForLogging(data),
            )}`,
          );
        },
        error: (error: unknown) => {
          const durationMs = Date.now() - startedAt;
          const statusCode =
            error instanceof Object && 'status' in error
              ? (error as { status?: number }).status
              : response.statusCode;
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `<-x ${method} ${originalUrl} ${statusCode ?? 500} +${durationMs}ms ${message}`,
          );
        },
      }),
    );
  }
}
