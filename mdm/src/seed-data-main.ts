import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeders/seeder.service';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './seeders/seeder.module';

@Module({
  imports: [
    DatabaseModule,
    SeederModule,
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
})
class AppModule {}

async function bootstrap() {
  initializeTransactionalContext();
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const seeder = appContext.get(SeederService);

  await seeder.run();
  await appContext.close();
}
bootstrap();
