import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserCredentialsResponse } from '../response/user-crendetial.response';
import { SessionRenewalCommand } from '../commands/session-renewal.command';
import { UserCredentialService } from '../services/user-credential-service';
import { BusinessException } from '@dnp2412/service-common';

@CommandHandler(SessionRenewalCommand)
export class SessionRenewalHandler
  implements ICommandHandler<SessionRenewalCommand, UserCredentialsResponse>
{
  constructor(private readonly userCredentialService: UserCredentialService) {}

  async execute(
    command: SessionRenewalCommand,
  ): Promise<UserCredentialsResponse> {
    const userId = await this.userCredentialService.getUserIdToken(
      command.refreshToken,
    );

    if (!userId) {
      throw new BusinessException({
        code: 'REGISTRATION_TOKEN_EXPIRED',
        message: 'Token expired',
      });
    }

    return this.userCredentialService.getUserCredentials(userId);
  }
}
