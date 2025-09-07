import { compare, hash } from 'bcryptjs';
import { Hasher } from '../use-cases/hasher';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BcryptHasher implements Hasher {
  compare(input: string, hash: string): Promise<boolean> {
    return compare(input, hash);
  }

  hash(input: string): Promise<string> {
    return hash(input, 10);
  }
}
