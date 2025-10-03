import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:5001',
      package: 'proto.mdm.country.v1',
      protoPath: ['proto/mdm/country/v1/country.proto'],
      loader: {
        includeDirs: [
          join(process.cwd(), 'node_modules/@dnp2412/shipping-protos'),
        ],
        arrays: true,
        objects: true,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'mdm',
        brokers: ['localhost:19092', 'localhost:19093'],
      },
      consumer: {
        groupId: 'mdm-service-group',
      },
    },
  });
  const logger = app.get(Logger);

  app.useLogger(logger);

  await app.init();
  await app.startAllMicroservices();
  logger.log('App listening on port GRPC 5001');
}

bootstrap();
