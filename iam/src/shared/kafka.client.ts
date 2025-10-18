import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

const KAFKA_CLIENT_NAME = Symbol.for('KAFKA_CLIENT_NAME');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'iam',
            brokers: ['localhost:19092', 'localhost:19093'],
          },
        },
      },
    ]),
  ],
})
export class KafkaModule {}
