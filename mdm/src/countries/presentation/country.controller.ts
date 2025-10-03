import { Controller } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchCountriesCommand } from '../use-cases/commands/search-countries.command';
import {
  CountryServiceController,
  CountryServiceControllerMethods,
  SearchCountry,
  SearchCountryResult,
} from '@dnp2412/shipping-protos/dist/proto/mdm/country/v1/country';

@CountryServiceControllerMethods()
@Controller()
export class CountryController implements CountryServiceController {
  constructor(private readonly queryBus: QueryBus) {}

  search(request: SearchCountry): Promise<SearchCountryResult> {
    return this.queryBus.execute(
      new SearchCountriesCommand(request.searchTerm),
    );
  }
}
