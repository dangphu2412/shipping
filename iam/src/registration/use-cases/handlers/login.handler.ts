import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCredentialsResponse } from '../response/user-crendetial.response';
import {
  UserRepository,
  UserRepositoryToken,
} from '../repositories/user.repository';
import { Inject } from '@nestjs/common';
import { BusinessException } from '@dnp2412/service-common';
import { LoginUserCommand } from '../commands/login.command';
import { UserCredentialService } from '../services/user-credential-service';
import { Hasher, HasherToken } from '../services/hasher';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler
  implements ICommandHandler<LoginUserCommand, UserCredentialsResponse>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    @Inject(HasherToken)
    private readonly hasher: Hasher,
    private readonly userCredentialService: UserCredentialService,
  ) {}

  async execute(command: LoginUserCommand): Promise<UserCredentialsResponse> {
    const user = await this.userRepository.findByUsername(command.username);

    if (!user) {
      throw new BusinessException({
        code: 'REGISTRATION_AUTH_FAILED',
        message: 'Wrong credentials.',
      });
    }

    if (!(await this.hasher.compare(command.password, user.password))) {
      throw new BusinessException({
        code: 'REGISTRATION_AUTH_FAILED',
        message: 'Wrong credentials.',
      });
    }

    return this.userCredentialService.getUserCredentials(user.id);
  }
}
