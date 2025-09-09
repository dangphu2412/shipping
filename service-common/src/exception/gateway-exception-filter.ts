import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BusinessException } from "./business-exception";

type HttpGatewayExceptionContext = {
  code: string;
  businessCode: string;
  message: string;
  details?: Record<string, unknown>;
  metadata: Metadata;
};

@Catch()
export class HttpGatewayExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpGatewayExceptionFilter.name);

  catch(
    exception: HttpGatewayExceptionContext | HttpException | Error,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    if (this.isBusinessException(exception)) {
      const businessCode = exception.metadata.get(BusinessException.BUSINESS_CODE_ID)[0];

      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        businessCode: businessCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof HttpException) {
      if (exception.getStatus() >= 500) {
        this.logger.error(exception);
        this.logger.error({
          body: request.body,
          params: request.params,
        });
      }

      return response.status(exception.getStatus()).send({
        statusCode: exception.getStatus(),
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    this.logger.error(exception);
    this.logger.error({
      type: 'exception_metadata',
      body: request.body,
      params: request.params,
    });

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private isBusinessException(
    exception: unknown,
  ): exception is HttpGatewayExceptionContext {
    if (!(exception as HttpGatewayExceptionContext).metadata) return false;

    return !!(exception as HttpGatewayExceptionContext).metadata.get(
      BusinessException.BUSINESS_CODE_ID,
    ).length;
  }
}
