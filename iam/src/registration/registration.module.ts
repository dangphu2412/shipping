import { Module } from '@nestjs/common';
import { RegisterUserHandler } from './use-cases/register.handler';
import { HasherToken } from './use-cases/hasher';
import { BcryptHasher } from './infras/bcrypt-hasher';
import { UserRepositoryImpl } from './infras/user.repository';
import { UserRepositoryToken } from './use-cases/user.repository';
import { RegistrationController } from './presentation/registration.controller';
import { JWTTokenCredentialService } from './infras/jwt-token-credential-service';
import { TokenCredentialServiceToken } from './use-cases/token-credential-service';

@Module({
  controllers: [RegistrationController],
  providers: [
    RegisterUserHandler,
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
