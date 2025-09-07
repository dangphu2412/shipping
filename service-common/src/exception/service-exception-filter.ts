import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from "@nestjs/common";
import { Metadata, status } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { BusinessException } from "./business-exception";

@Catch()
export class RpcServiceExceptionFilter
  extends BaseRpcExceptionFilter<BusinessException | Error>
  implements RpcExceptionFilter<BusinessException | Error>
{
  private logger = new Logger(RpcServiceExceptionFilter.name);

  catch(
    exception: BusinessException | Error,
    host: ArgumentsHost,
  ): Observable<any> {
    if (exception instanceof BusinessException) {
      this.logger.warn(exception);

      const metadata = new Metadata();
      metadata.set("business_code", exception.code);

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
