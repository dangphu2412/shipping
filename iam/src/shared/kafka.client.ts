import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const KAFKA_CLIENT_NAME = Symbol.for('KAFKA_CLIENT_NAME');

@Module({
  providers: [
    {
      provide: KAFKA_CLIENT_NAME,
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'iam',
              brokers: ['localhost:19092', 'localhost:19093'],
            },
          },
        });
      },
    },
  ],
  exports: [KAFKA_CLIENT_NAME],
})
export class KafkaModule {}
