import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UserRepository,
} from '../../domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { ApprovalCommand } from '../commands/approval.command';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_CLIENT_NAME } from '../../../shared/kafka.client';

@CommandHandler(ApprovalCommand)
export class ApprovalHandler implements ICommandHandler<ApprovalCommand, void> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(KAFKA_CLIENT_NAME)
    private readonly kafkaClient: ClientKafka,
  ) {}

  execute(command: ApprovalCommand): Promise<void> {
    console.log(command);
    this.kafkaClient.emit('USER_APPROVED', {
      userId: command.userId,
    });
    return Promise.resolve();
  }
}
