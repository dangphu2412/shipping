import { Command } from '@nestjs/cqrs';
import { UserCredentialsResponse } from '../response/user-crendetial.response';

export class RegisterUserCommand extends Command<UserCredentialsResponse> {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {
    super();
  }
}
