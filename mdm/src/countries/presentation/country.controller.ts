import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SearchCountriesCommand } from '../use-cases/commands/search-countries.command';

@Controller()
export class CountryController {
  constructor(private commandBus: CommandBus) {}

  search() {
    return this.commandBus.execute(new SearchCountriesCommand());
  }
}
