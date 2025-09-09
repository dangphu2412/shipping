import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  SearchCountriesCommand,
  SearchCountryResult,
} from '../commands/search-countries.command';
import {
  CountryRepository,
  CountryRepositoryToken,
} from '../../domain/repositories/country.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(SearchCountriesCommand)
export class SearchCountryHandler
  implements IQueryHandler<SearchCountriesCommand>
{
  constructor(
    @Inject(CountryRepositoryToken)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute(
    searchCountriesCommand: SearchCountriesCommand,
  ): Promise<SearchCountryResult> {
    return this.countryRepository.search(searchCountriesCommand);
  }
}
