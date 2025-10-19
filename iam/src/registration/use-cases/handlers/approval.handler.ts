import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  UserRepository,
} from '../../domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { ApprovalCommand } from '../commands/approval.command';

@CommandHandler(ApprovalCommand)
export class ApprovalHandler implements ICommandHandler<ApprovalCommand, void> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  execute(command: ApprovalCommand): Promise<void> {
    console.log(command);
    return Promise.resolve();
  }
}
