import { Module, RequestMethod } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { IamModule } from './iam/iam.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpGatewayExceptionFilter } from '@dnp2412/service-common';
import { MdmModule } from './mdm/mdm.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    HealthCheckModule,
    IamModule,
    MdmModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');

        return {
          pinoHttp: {
            level: nodeEnv !== 'production' ? 'debug' : 'info',
            transport:
              nodeEnv !== 'production' ? { target: 'pino-pretty' } : undefined,
          },
          exclude: [{ method: RequestMethod.ALL, path: 'health-check' }],
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpGatewayExceptionFilter,
    },
  ],
})
export class AppModule {}
