import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  RegisterUserCommand,
  UserCredentialsResponse,
} from './register.command';
import { UserRepository, UserRepositoryToken } from './user.repository';
import { Inject } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import {
  TokenCredentialService,
  TokenCredentialServiceToken,
} from './token-credential-service';
import { BusinessException } from '../../exception/exception';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, UserCredentialsResponse>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    @Inject(TokenCredentialServiceToken)
    private readonly tokenCredentialService: TokenCredentialService,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<UserCredentialsResponse> {
    const user = await this.userRepository.findByUsername(command.username);

    if (user) {
      throw new BusinessException({
        code: 'REGISTRATION_USER_EXISTED',
        message: 'User existed',
      });
    }

    const newUser = User.createNew(command.username, 'admin', command.password);

    const id = await this.userRepository.createNew(newUser);

    return {
      accessToken: await this.tokenCredentialService.encode({ id }),
      refreshToken: '',
    };
  }
}
