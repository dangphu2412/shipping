import { Module } from '@nestjs/common';
import { SearchCountryHandler } from './use-cases/handlers/search-country.handler';
import { CountryRepositoryToken } from './domain/repositories/country.repository';
import { CountryController } from './presentation/country.controller';
import { CountryRepositoryImpl } from './infras/country.repository';

@Module({
  controllers: [CountryController],
  providers: [
    SearchCountryHandler,
    {
      provide: CountryRepositoryToken,
      useClass: CountryRepositoryImpl,
    },
  ],
})
export class CountryModule {}
