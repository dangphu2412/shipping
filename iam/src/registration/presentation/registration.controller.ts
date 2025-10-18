import { Controller } from '@nestjs/common';
import {
  UserApproval,
  UserBasicLogin,
  UserCredentials,
  UserRegistration,
  UserRegistrationServiceController,
  UserRegistrationServiceControllerMethods,
  UserSessionRenewal,
} from '@dnp2412/shipping-protos/dist/index.proto.iam.registration.v1';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../use-cases/commands/register.command';
import { LoginUserCommand } from '../use-cases/commands/login.command';
import { SessionRenewalCommand } from '../use-cases/commands/session-renewal.command';
import { ApprovalCommand } from '../use-cases/commands/approval.command';

@UserRegistrationServiceControllerMethods()
@Controller()
export class RegistrationController
  implements UserRegistrationServiceController
{
  constructor(private readonly commandBus: CommandBus) {}

  // @ts-ignore
  async approve(request: UserApproval): void {
    await this.commandBus.execute(new ApprovalCommand(request.userId));
  }

  login(userBasicLogin: UserBasicLogin): Promise<UserCredentials> {
    return this.commandBus.execute(
      new LoginUserCommand(userBasicLogin.username, userBasicLogin.password),
    );
  }

  renew(userSessionRenewal: UserSessionRenewal): Promise<UserCredentials> {
    return this.commandBus.execute(
      new SessionRenewalCommand(userSessionRenewal.refreshToken),
    );
  }

  async register(userRegistration: UserRegistration): Promise<UserCredentials> {
    await this.commandBus.execute(
      new RegisterUserCommand(
        userRegistration.username,
        userRegistration.password,
      ),
    );

    return {
      accessToken: '',
      refreshToken: '',
    };
  }
}
