export const HasherToken = 'HasherToken' as const;

export interface Hasher {
  hash(input: string): Promise<string>;
  compare(input: string, hash: string): Promise<boolean>;
}
