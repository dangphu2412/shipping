import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Patch,
  Post,
} from '@nestjs/common';
import {
  USER_REGISTRATION_SERVICE_NAME,
  UserApproval,
  UserBasicLogin,
  UserRegistration,
  UserRegistrationServiceClient,
  UserSessionRenewal,
} from '@dnp2412/shipping-protos/dist/proto/iam/registration/v1/user_registration';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('/registration')
export class RegistrationController implements OnModuleInit {
  private userRegistrationServiceClient: UserRegistrationServiceClient;

  constructor(
    @Inject('IAM_REGISTRATION')
    private readonly client: ClientGrpc,
  ) {}

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

  @Post('login')
  login(@Body() body: UserBasicLogin) {
    return this.userRegistrationServiceClient.login(body);
  }

  @Post('renew')
  renew(@Body() body: UserSessionRenewal) {
    return this.userRegistrationServiceClient.renew(body);
  }

  @Patch('approve')
  approve(@Body() body: UserApproval) {
    return this.userRegistrationServiceClient.approve(body);
  }
}
