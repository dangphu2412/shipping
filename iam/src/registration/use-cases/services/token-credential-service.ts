export const TokenCredentialServiceToken = 'TokenCredentialService' as const;

export type TokenInfo = {
  id: string;
};

export type EncodeOptions = {
  expiresIn: string;
};

export interface TokenCredentialService {
  encode(info: TokenInfo, encodeOptions: EncodeOptions): Promise<string>;
  decode(input: string): Promise<TokenInfo>;
}
