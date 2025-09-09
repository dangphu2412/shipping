import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchCountriesCommand } from '../commands/search-countries.command';
import {
  CountryRepository,
  CountryRepositoryToken,
} from '../../domain/repositories/country.repository';
import { Inject } from '@nestjs/common';
import { Country } from '../../domain/entities/country.entity';

@QueryHandler(SearchCountriesCommand)
export class SearchCountryHandler
  implements IQueryHandler<SearchCountriesCommand>
{
  constructor(
    @Inject(CountryRepositoryToken)
    private readonly countryRepository: CountryRepository,
  ) {}

  execute(searchCountriesCommand: SearchCountriesCommand): Promise<Country[]> {
    return this.countryRepository.search(searchCountriesCommand);
  }
}
