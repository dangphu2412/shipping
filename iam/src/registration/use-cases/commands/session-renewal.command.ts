import { Command } from '@nestjs/cqrs';
import { UserCredentialsResponse } from '../response/user-crendetial.response';

export class SessionRenewalCommand extends Command<UserCredentialsResponse> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}
