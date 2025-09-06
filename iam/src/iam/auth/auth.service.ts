import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseClient, DB_TOKEN } from '../../database/database.module';
import { users } from '../../database/schema';
import { LoginDTO, LoginResponse, RegisterDTO } from './auth.controller';
import { eq } from 'drizzle-orm';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_TOKEN)
    private readonly databaseClient: DatabaseClient,
  ) {}

  async login(loginDTO: LoginDTO) {
    const [user] = await this.databaseClient
      .select()
      .from(users)
      .where(eq(users.email, loginDTO.username))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid login credentials');
    }
    const accessToken = sign({ sub: user.id } as object, 'secret', {
      expiresIn: '1m',
    });
    const refreshToken = sign({ sub: user.id } as object, 'secret', {
      expiresIn: '15m',
    });

    return {
      accessToken,
      refreshToken,
    } as LoginResponse;
  }

  renew(refreshToken: string) {
    const payload = verify(refreshToken, 'secret');

    if (typeof payload === 'string') {
      throw new Error('Invalid renew credentials');
    }

    return {
      accessToken: sign({ sub: payload.sub as string } as object, 'secret', {
        expiresIn: '1m',
      }),
    };
  }

  register(registerDTO: RegisterDTO) {
    return this.databaseClient
      .insert(users)
      .values({
        ...registerDTO,
        email: registerDTO.username,
        role: 'member',
      })
      .execute();
  }
}
