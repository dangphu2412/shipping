import { Query } from '@nestjs/cqrs';
import { Country } from '../../domain/entities/country.entity';

export type SearchCountryResult = {
  items: Country[];
  metadata: {
    totalItems: number;
  };
};

export class SearchCountriesCommand extends Query<SearchCountryResult> {
  constructor(public searchTerm?: string) {
    super();
  }
}
