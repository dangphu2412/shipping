import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register.command';
import { UserCredentialsResponse } from '../response/user-crendetial.response';
import {
  UserRepository,
  UserRepositoryToken,
} from '../repositories/user.repository';
import { Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { BusinessException } from '@dnp2412/service-common';
import { UserCredentialService } from '../services/user-credential-service';
import { Hasher, HasherToken } from '../services/hasher';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, UserCredentialsResponse>
{
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
    @Inject(HasherToken)
    private readonly hasher: Hasher,
    private readonly userCredentialService: UserCredentialService,
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

    const newUser = User.createNew(
      command.username,
      'admin',
      await this.hasher.hash(command.password),
    );

    const id = await this.userRepository.createNew(newUser);

    return this.userCredentialService.getUserCredentials(id);
  }
}
