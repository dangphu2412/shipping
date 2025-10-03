import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

export class UserRegisteredEvent {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly username: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}

@Controller()
export class CountryEventController {
  @EventPattern('IAM_USER_REGISTERED_EVENT')
  userRegisteredEvent(@Payload() message: UserRegisteredEvent) {
    Logger.log('Receiving IAM_USER_REGISTERED_EVENT message');
    Logger.log(message);
  }
}
