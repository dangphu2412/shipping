import { Inject, Injectable } from '@nestjs/common';
import { DatabaseClient, DB_TOKEN } from '../database/database.module';
import { CreateSprintDto, UpdateSprintDto } from './sprints.controller';
import { sprints } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SprintsService {
  constructor(
    @Inject(DB_TOKEN)
    private readonly databaseClient: DatabaseClient,
  ) {}

  create(createSprintDto: CreateSprintDto) {
    return this.databaseClient.insert(sprints).values({
      ...createSprintDto,
    });
  }

  findAll() {
    return this.databaseClient.select().from(sprints);
  }

  findOne(id: string) {
    return this.databaseClient.select().from(sprints).where(eq(sprints.id, id));
  }

  update(id: string, updateSprintDto: UpdateSprintDto) {
    return this.databaseClient
      .update(sprints)
      .set(updateSprintDto)
      .where(eq(sprints.id, id));
  }

  remove(id: string) {
    return this.databaseClient.delete(sprints).where(eq(sprints.id, id));
  }
}
