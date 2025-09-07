import { Inject, Injectable } from '@nestjs/common';
import {
  TokenCredentialService,
  TokenCredentialServiceToken,
} from './token-credential-service';
import { UserCredentialsResponse } from '../response/user-crendetial.response';

@Injectable()
export class UserCredentialService {
  constructor(
    @Inject(TokenCredentialServiceToken)
    private readonly tokenCredentialService: TokenCredentialService,
  ) {}

  async getUserCredentials(id: string): Promise<UserCredentialsResponse> {
    return {
      accessToken: await this.tokenCredentialService.encode(
        { id },
        { expiresIn: '1m' },
      ),
      refreshToken: await this.tokenCredentialService.encode(
        { id },
        { expiresIn: '15m' },
      ),
    };
  }

  async getUserIdToken(token: string): Promise<string | null> {
    const { id } = await this.tokenCredentialService.decode(token);

    return id;
  }
}
