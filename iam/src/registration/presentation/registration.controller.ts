import { Controller } from '@nestjs/common';
import {
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

@UserRegistrationServiceControllerMethods()
@Controller()
export class RegistrationController
  implements UserRegistrationServiceController
{
  constructor(private commandBus: CommandBus) {}

  login(userBasicLogin: UserBasicLogin): Promise<UserCredentials> {
    console.log(userBasicLogin);
    return this.commandBus.execute(
      new LoginUserCommand(userBasicLogin.username, userBasicLogin.password),
    );
  }

  renew(userSessionRenewal: UserSessionRenewal): Promise<UserCredentials> {
    return this.commandBus.execute(
      new SessionRenewalCommand(userSessionRenewal.refreshToken),
    );
  }

  register(userRegistration: UserRegistration): Promise<UserCredentials> {
    return this.commandBus.execute(
      new RegisterUserCommand(
        userRegistration.username,
        userRegistration.password,
      ),
    );
  }
}
