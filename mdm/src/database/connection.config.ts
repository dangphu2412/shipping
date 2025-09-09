import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { CountryEntity } from './country.entity';

dotenvConfig({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  migrationsRun: true,
  synchronize: false,
  entities: [CountryEntity],
  migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
  migrationsTableName: 'mdm_migrations',
  url: process.env.DATABASE_URL,
  logging: process.env.NODE_ENV !== 'production',
});
