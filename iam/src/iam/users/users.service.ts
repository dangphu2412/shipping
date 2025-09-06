import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClient, DB_TOKEN } from '../../database/database.module';
import { users } from '../../database/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB_TOKEN)
    private readonly databaseClient: DatabaseClient,
  ) {}

  findAll() {
    return this.databaseClient.select().from(users);
  }
}
