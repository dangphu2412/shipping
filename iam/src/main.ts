import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        port: 5000,
        package: 'proto.iam.registration.v1',
        protoPath: 'proto/iam/registration/v1/user_registration.proto',
        loader: {
          includeDirs: [
            join(process.cwd(), 'node_modules/@dnp2412/shipping-protos'),
          ],
          arrays: true,
          objects: true,
        },
      },
      bufferLogs: true,
    },
  );
  const logger = app.get(Logger);

  app.useLogger(logger);

  await app.listen();
}

bootstrap();
