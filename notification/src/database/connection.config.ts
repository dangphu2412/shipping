import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { UserEntity } from './user.entity';

dotenvConfig({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  migrationsRun: true,
  synchronize: false,
  entities: [UserEntity],
  migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV !== 'production',
});
