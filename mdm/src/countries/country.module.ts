import { Module } from '@nestjs/common';
import { SearchCountryHandler } from './use-cases/handlers/search-country.handler';
import { CountryRepositoryToken } from './domain/repositories/country.repository';
import { CountryController } from './presentation/country.controller';
import { CountryRepositoryImpl } from './infras/country.repository';
import { CountryEventController } from './presentation/country-event.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT } from '../shared/kafka/kafka.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'iam',
            brokers: ['localhost:19092', 'localhost:19093'],
          },
        },
      },
    ]),
  ],
  controllers: [CountryController, CountryEventController],
  providers: [
    SearchCountryHandler,
    {
      provide: CountryRepositoryToken,
      useClass: CountryRepositoryImpl,
    },
  ],
})
export class CountryModule {}
