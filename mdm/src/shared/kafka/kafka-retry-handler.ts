import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientKafkaProxy, KafkaContext } from '@nestjs/microservices';
import { KAFKA_CLIENT } from './kafka.module';
import { KafkaMessage } from 'kafkajs';

@Catch()
export class KafkaMaxRetryExceptionFilter implements ExceptionFilter {
  private readonly maxRetries = 2;
  private readonly logger = new Logger(KafkaMaxRetryExceptionFilter.name);

  constructor(
    @Inject(KAFKA_CLIENT)
    private readonly client: ClientKafkaProxy,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const kafkaContext = host.switchToRpc().getContext<KafkaContext>();
    const message = kafkaContext.getMessage();

    const retryAttempts = message.headers?.['x-retry-attempts']
      ? parseInt(message.headers?.['x-retry-attempts'] as string, 10)
      : 2;

    if (retryAttempts === 0) {
      try {
        this.client.emit<KafkaMessage>('MDM_DEAD_TOPIC', {
          ...message,
          headers: {
            'x-topic': kafkaContext.getTopic(),
            ...message.headers,
          },
        });

        await this.commitOffset(kafkaContext);
      } catch (commitError) {
        this.logger.error('Failed to commit offset:', commitError);
      }
      return;
    }

    try {
      this.client.emit<KafkaMessage>(kafkaContext.getTopic(), {
        ...message,
        headers: {
          'x-retry-attempts': (retryAttempts - 1).toString(),
          ...message.headers,
        },
      });

      await this.commitOffset(kafkaContext);
    } catch (commitError) {
      this.logger.error('Failed to commit offset:', commitError);
    }
  }

  private async commitOffset(context: KafkaContext): Promise<void> {
    const consumer = context?.getConsumer();
    if (!consumer) {
      throw new Error('Consumer instance is not available from KafkaContext.');
    }

    const topic = context?.getTopic();
    const partition = context?.getPartition();
    const message = context.getMessage();
    const offset = message.offset;

    if (!topic || partition === undefined || offset === undefined) {
      throw new Error(
        'Incomplete Kafka message context for committing offset.',
      );
    }

    await consumer.commitOffsets([
      {
        topic,
        partition,
        // When committing an offset, commit the next number (i.e., current offset + 1)
        offset: (Number(offset) + 1).toString(),
      },
    ]);
  }
}
