import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CountryEntity } from './country.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          migrationsRun: true,
          synchronize: false,
          entities: [CountryEntity],
          migrations: [join(__dirname, './migrations/*{.ts,.js}')],
          migrationsTableName: 'migrations',
          url: configService.getOrThrow<string>('DATABASE_URL'),
          logging: configService.get('NODE_ENV') !== 'production',
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
  ],
})
export class DatabaseModule {}
