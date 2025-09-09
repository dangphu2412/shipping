import { Query } from '@nestjs/cqrs';
import { Country } from '../../domain/entities/country.entity';

export class SearchCountriesCommand extends Query<Country[]> {
  searchTerm?: string;
}
