import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { BusinessException } from '@dnp2412/service-common';
import { Hasher, HasherToken } from '../services/hasher';
import { ORKES_CLIENT } from '../../../shared/orkes.client';
import { ConductorClient } from '@io-orkes/conductor-javascript';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand, void>
{
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(HasherToken)
    private readonly hasher: Hasher,
    @Inject(ORKES_CLIENT)
    private readonly client: ConductorClient,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
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

    await this.client.workflowResource.startWorkflow({
      name: 'Onboarding',
      version: 1,
      input: {
        userId: id,
      },
    });
  }
}
