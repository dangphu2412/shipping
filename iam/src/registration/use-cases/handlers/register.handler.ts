import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../commands/register.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { BusinessException } from '@dnp2412/service-common';
import { Hasher, HasherToken } from '../services/hasher';
import { ORKES_CLIENT } from '../../../shared/orkes.client';
import { ConductorClient } from '@io-orkes/conductor-javascript';

// {
//   "name": "Onboarding",
//   "description": "Onboarding user workflow",
//   "version": 1,
//   "tasks": [
//   {
//     "name": "Onboarding",
//     "type": "HTTP",
//     "inputParameters": {
//       "http_request": {
//         "uri": "http://localhost:3000/notification",
//         "method": "POST",
//         "body": {
//           "recipients": "${workflow.input.to}"
//         },
//         "contentType": "application/json"
//       }
//     }
//   }
// ],
//   "inputParameters": ["to"],
//   "schemaVersion": 2,
//   "restartable": true,
//   "workflowStatusListenerEnabled": false,
//   "ownerEmail": "example@email.com",
//   "timeoutPolicy": "ALERT_ONLY",
//   "timeoutSeconds": 0
// }

// {
//   "name": "send_notification_task",
//   "description": "Send notification to list of recipients via HTTP POST /notification endpoint",
//   "retryCount": 3,
//   "timeoutSeconds": 120,
//   "timeoutPolicy": "RETRY",
//   "retryLogic": "FIXED",
//   "retryDelaySeconds": 10,
//   "responseTimeoutSeconds": 30,
//   "ownerEmail": "example@email.com",
//   "inputKeys": ["to"],
//   "outputKeys": [],
//   "type": "HTTP",
//   "http_request": {
//   "uri": "http://localhost/notifications/mails",
//     "method": "POST",
//     "contentType": "application/json",
//     "body": "${workflow.input.to}",
//     "readTimeOut": 30000
// }
// }

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
