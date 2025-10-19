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
//   "ownerApp": null,
//   "createTime": 1760781746235,
//   "updateTime": 1760847756353,
//   "createdBy": null,
//   "updatedBy": null,
//   "accessPolicy": {},
//   "name": "Onboarding",
//   "description": "Onboarding user workflow",
//   "version": 7,
//   "tasks": [
//   {
//     "name": "Onboarding",
//     "taskReferenceName": "send_notification_task",
//     "description": null,
//     "inputParameters": {
//       "http_request": {
//         "uri": "http://host.docker.internal:3000/notifications/mails",
//         "method": "POST",
//         "body": {
//           "to": [
//             "${workflow.input.userId}"
//           ]
//         },
//         "contentType": "application/json"
//       }
//     },
//     "type": "HTTP",
//     "dynamicTaskNameParam": null,
//     "caseValueParam": null,
//     "caseExpression": null,
//     "scriptExpression": null,
//     "dynamicForkJoinTasksParam": null,
//     "dynamicForkTasksParam": null,
//     "dynamicForkTasksInputParamName": null,
//     "startDelay": 0,
//     "subWorkflowParam": null,
//     "sink": null,
//     "optional": false,
//     "taskDefinition": null,
//     "rateLimited": null,
//     "asyncComplete": false,
//     "loopCondition": null,
//     "retryCount": null,
//     "evaluatorType": null,
//     "expression": null
//   }
// ],
//   "inputParameters": [
//   "to"
// ],
//   "outputParameters": {},
//   "failureWorkflow": null,
//   "schemaVersion": 2,
//   "restartable": true,
//   "workflowStatusListenerEnabled": false,
//   "ownerEmail": "example@email.com",
//   "timeoutPolicy": "ALERT_ONLY",
//   "timeoutSeconds": 0,
//   "variables": {},
//   "inputTemplate": {}
// }

// {
//   "ownerApp": null,
//   "createTime": null,
//   "updateTime": 1760846941375,
//   "createdBy": null,
//   "updatedBy": "",
//   "accessPolicy": {},
//   "name": "send_notification_task",
//   "description": "Sends notification emails via internal service",
//   "retryCount": 3,
//   "timeoutSeconds": 30,
//   "inputKeys": [],
//   "outputKeys": [],
//   "timeoutPolicy": "TIME_OUT_WF",
//   "retryLogic": "FIXED",
//   "retryDelaySeconds": 5,
//   "responseTimeoutSeconds": 15,
//   "concurrentExecLimit": null,
//   "inputTemplate": {},
//   "rateLimitPerFrequency": 10,
//   "rateLimitFrequencyInSeconds": 60,
//   "isolationGroupId": null,
//   "executionNameSpace": null,
//   "ownerEmail": "example@email.com",
//   "pollTimeoutSeconds": null,
//   "backoffScaleFactor": 1
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
      version: 7,
      input: {
        userId: id,
      },
    });
  }
}
