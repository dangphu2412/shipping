import { Country } from '../entities/country.entity';

export const CountryRepositoryToken = 'CountryRepositoryToken';
export interface CountryRepository {
  search(searchCountryDTO: SearchCountryDTO): Promise<SearchCountryResult>;
}

export type SearchCountryDTO = {
  searchTerm?: string;
};
export type SearchCountryResult = {
  items: Country[];
  metadata: {
    totalItems: number;
  };
};
