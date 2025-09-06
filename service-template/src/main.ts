import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import compression from '@fastify/compress';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  await app.register(compression);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.enableCors({
    origin: '*',
  });

  const configService = app.get(ConfigService);

  const port = configService.get<string>('PORT', '3000');
  await app.listen(port);

  logger.log(`Server started on port ${await app.getUrl()}`);
}
bootstrap();
