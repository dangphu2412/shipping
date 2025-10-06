import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
export const KAFKA_CLIENT = Symbol('KAFKA_CLIENT');

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
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
