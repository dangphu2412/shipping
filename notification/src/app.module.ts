import { Module, RequestMethod } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { MailModule } from './registration/mail.module';
import { APP_FILTER } from '@nestjs/core';
import { RpcServiceExceptionFilter } from '@dnp2412/service-common';

@Module({
  imports: [
    DatabaseModule,
    HealthCheckModule,
    MailModule,
    CqrsModule.forRoot(),
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
      useClass: RpcServiceExceptionFilter,
    },
  ],
})
export class AppModule {}
