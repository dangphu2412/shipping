import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { MailController } from './mail.controller';

@Module({
  controllers: [MailController],
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5001',
          package: 'proto.notification.mail.v1',
          protoPath: 'proto/notification/mail/v1/mail.proto',
          loader: {
            includeDirs: [
              join(process.cwd(), 'node_modules/@dnp2412/shipping-protos'),
            ],
            arrays: true,
            objects: true,
          },
        },
      },
    ]),
  ],
})
export class NotificationModule {}
