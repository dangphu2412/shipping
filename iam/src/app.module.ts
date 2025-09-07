import { Module, RequestMethod } from '@nestjs/common';
import { HealthCheckModule } from './health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RegistrationModule } from './registration/registration.module';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './exception/exception';

@Module({
  imports: [
    DatabaseModule,
    HealthCheckModule,
    RegistrationModule,
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
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
