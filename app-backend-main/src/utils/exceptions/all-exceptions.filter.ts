import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponseHttpInterface } from '@utils/interfaces';
import { ThrottlerException } from '@nestjs/throttler';
import { MailSendException } from '@utils/exceptions/MailSendException';
import { ErrorCodeEnum } from '@auth/enums';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponseHttp: ErrorResponseHttpInterface = {
      error: ErrorCodeEnum.SERVER_ERROR,
      message: 'Unexpected error occurred',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const { message, error, data } = exception.getResponse() as ErrorResponseHttpInterface;

      if (data) errorResponseHttp.data = data;

      errorResponseHttp.error = error;
      errorResponseHttp.message = message;

      if (exception instanceof BadRequestException) {
        errorResponseHttp.message = message;
      }

      if (exception instanceof UnprocessableEntityException) {
        errorResponseHttp.error = ErrorCodeEnum.UNPROCESSABLE_ENTITY;
        errorResponseHttp.message = message;
      }

      if (exception instanceof UnauthorizedException) {
        errorResponseHttp.message = message ?? 'Credenciales no válidas';
      }

      if (exception instanceof NotFoundException) {
        errorResponseHttp.message = message;
      }

      if (exception instanceof ForbiddenException) {
        errorResponseHttp.message = message;
      }

      if (exception instanceof ThrottlerException) {
        errorResponseHttp.data = null;
        errorResponseHttp.message =
          'Has superado el límite de solicitudes permitidas. Por favor, espera un momento antes de intentarlo nuevamente.';
      }

      if (exception instanceof ServiceUnavailableException) {
        errorResponseHttp.data = {
          startedAt: '2023-08-25',
          endedAt: '2023-08-31',
        };

        errorResponseHttp.message =
          'El sistema se encuentra en mantenimiento, lamentamos las molestias causadas';
      }

      return response.status(status).json(errorResponseHttp);
    }

    if (exception instanceof QueryFailedError) {
      status = 400;
      errorResponseHttp.message = exception?.driverError?.detail || 'Query Error';

      return response.status(status).json(errorResponseHttp);
    }

    if (exception instanceof MailSendException) {
      status = exception.getStatus();
      const { message } = exception.getResponse() as ErrorResponseHttpInterface;

      errorResponseHttp.message = message || exception.message || 'Error';

      return response.status(status).json(errorResponseHttp);
    }

    if (exception instanceof Error && status === 500) {
      errorResponseHttp.error = exception.name || 'Error';
      errorResponseHttp.message = exception.message || 'Error';
    }

    response.status(status).json(errorResponseHttp);
  }
}
