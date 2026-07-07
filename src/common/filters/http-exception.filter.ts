import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

function extractMessage(exception: HttpException): string {
  const body = exception.getResponse();

  if (typeof body === 'string') {
    return body;
  }

  if (typeof body === 'object' && body !== null && 'message' in body) {
    const { message } = body as { message: string | string[] };
    return Array.isArray(message) ? message.join(', ') : message;
  }

  return exception.message;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? extractMessage(exception)
        : 'Internal server error';

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.message : exception,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const body: ApiResponse<null> = {
      success: false,
      statusCode,
      message,
      data: null,
    };

    response.status(statusCode).json(body);
  }
}
