import { Module } from '@nestjs/common';
import { RegisterUserHandler } from './use-cases/handlers/register.handler';
import { HasherToken } from './use-cases/services/hasher';
import { BcryptHasher } from './infras/bcrypt-hasher';
import { UserRepositoryImpl } from './infras/user.repository';
import { UserRepositoryToken } from './domain/repositories/user.repository';
import { RegistrationController } from './presentation/registration.controller';
import { JWTTokenCredentialService } from './infras/jwt-token-credential-service';
import { TokenCredentialServiceToken } from './use-cases/services/token-credential-service';
import { UserCredentialService } from './use-cases/services/user-credential-service';
import { LoginUserHandler } from './use-cases/handlers/login.handler';
import { SessionRenewalHandler } from './use-cases/handlers/session-renewal.handler';

@Module({
  controllers: [RegistrationController],
  providers: [
    RegisterUserHandler,
    LoginUserHandler,
    SessionRenewalHandler,
    UserCredentialService,
    {
      provide: HasherToken,
      useClass: BcryptHasher,
    },
    {
      provide: UserRepositoryToken,
      useClass: UserRepositoryImpl,
    },
    {
      provide: TokenCredentialServiceToken,
      useClass: JWTTokenCredentialService,
    },
  ],
})
export class RegistrationModule {}
