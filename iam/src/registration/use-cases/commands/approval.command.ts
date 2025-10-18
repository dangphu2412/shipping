import { Command } from '@nestjs/cqrs';

export class ApprovalCommand extends Command<void> {
  constructor(
    public readonly userId: string,
  ) {
    super();
  }
}
