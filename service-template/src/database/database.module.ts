import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export type DatabaseClient = ReturnType<typeof drizzle>;

export const DB_TOKEN = 'DB_TOKEN';

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow<string>('DATABASE_URL'),
        });

        const instance = drizzle(pool, { schema });

        const client = await instance.$client.connect();

        client.release();

        Logger.log('Database connected');

        return instance;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
