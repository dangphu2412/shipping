import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext, KafkaRetriableException,
  Payload,
} from '@nestjs/microservices';
import { KafkaMaxRetryExceptionFilter } from '../../shared/kafka/kafka-retry-handler';

export class UserRegisteredEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

@UseFilters(KafkaMaxRetryExceptionFilter)
@Controller()
export class CountryEventController {
  @EventPattern('IAM_USER_REGISTERED_EVENT')
  async userRegisteredEvent(
    @Payload() message: UserRegisteredEvent,
    @Ctx() context: KafkaContext,
  ) {
    Logger.log('Receiving IAM_USER_REGISTERED_EVENT message');
    Logger.log(message);
    const { offset } = context.getMessage();
    Logger.log(offset);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (new Date().getTime() % 2) {
          Logger.log('Committing');
          return resolve({});
        }

        Logger.log('Raise error');
        reject(new KafkaRetriableException('Exception retry raised'));
      }, 1000);
    });
  }
}
