import {
  EncodeOptions,
  TokenCredentialService,
  TokenInfo,
} from '../use-cases/services/token-credential-service';
import { sign, SignOptions, verify } from 'jsonwebtoken';

export class JWTTokenCredentialService implements TokenCredentialService {
  decode(token: string): Promise<TokenInfo> {
    return Promise.resolve(verify(token, 'secret') as TokenInfo);
  }

  encode(info: TokenInfo, encodeOptions: EncodeOptions): Promise<string> {
    return Promise.resolve(
      sign(info, 'secret', {
        expiresIn: encodeOptions.expiresIn as SignOptions['expiresIn'],
      }),
    );
  }
}
