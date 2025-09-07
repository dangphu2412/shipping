export const TokenCredentialServiceToken = 'TokenCredentialService' as const;

export type TokenInfo = {
  id: string;
};

export interface TokenCredentialService {
  encode(info: TokenInfo): Promise<string>;
  decode(input: string): Promise<TokenInfo>;
}
