import { Controller } from '@nestjs/common';
import {
  UserCredentials,
  UserRegistration,
  UserRegistrationServiceController,
  UserRegistrationServiceControllerMethods,
} from '@dnp2412/shipping-protos/dist/proto/iam/registration/v1/user_registration';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../use-cases/register.command';

@UserRegistrationServiceControllerMethods()
@Controller()
export class RegistrationController
  implements UserRegistrationServiceController
{
  constructor(private commandBus: CommandBus) {}

  register(userRegistration: UserRegistration): Promise<UserCredentials> {
    return this.commandBus.execute<RegisterUserCommand, UserCredentials>(
      new RegisterUserCommand(
        userRegistration.username,
        userRegistration.password,
      ),
    );
  }
}
