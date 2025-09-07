import {
  TokenCredentialService,
  TokenInfo,
} from '../use-cases/token-credential-service';
import { sign, verify } from 'jsonwebtoken';

export class JWTTokenCredentialService implements TokenCredentialService {
  decode(token: string): Promise<TokenInfo> {
    return Promise.resolve(verify(token, 'secret') as TokenInfo);
  }

  encode(info: TokenInfo): Promise<string> {
    return Promise.resolve(
      sign(info, 'secret', {
        expiresIn: '1m',
      }),
    );
  }
}
