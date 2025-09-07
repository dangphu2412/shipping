import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import {
  USER_REGISTRATION_SERVICE_NAME,
  UserRegistration,
  UserRegistrationServiceClient,
} from '@dnp2412/shipping-protos/dist/proto/iam/registration/v1/user_registration';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('/registration')
export class RegistrationController implements OnModuleInit {
  private userRegistrationServiceClient: UserRegistrationServiceClient;

  constructor(@Inject('IAM_REGISTRATION') private client: ClientGrpc) {}

  onModuleInit() {
    this.userRegistrationServiceClient =
      this.client.getService<UserRegistrationServiceClient>(
        USER_REGISTRATION_SERVICE_NAME,
      );
  }
  @Post()
  register(@Body() body: UserRegistration) {
    return this.userRegistrationServiceClient.register(body);
  }
}
