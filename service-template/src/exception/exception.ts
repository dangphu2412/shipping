import { Metadata, status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';

type ExceptionContext = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export class BusinessException extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor({ code, message, details }: ExceptionContext) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

@Catch()
export class AppExceptionFilter
  extends BaseRpcExceptionFilter
  implements RpcExceptionFilter
{
  private logger = new Logger(AppExceptionFilter.name);

  catch(exception: BusinessException | Error, host: ArgumentsHost) {
    if (exception instanceof BusinessException) {
      this.logger.warn(exception);

      const metadata = new Metadata();
      metadata.set('business_code', exception.code);

      return super.catch(
        new RpcException({
          code: status.FAILED_PRECONDITION,
          message: exception.message,
          details: JSON.stringify(exception.details),
          metadata,
        }),
        host,
      );
    }

    return super.catch(exception, host);
  }
}
