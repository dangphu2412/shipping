import { Country } from '../entities/country.entity';

export const CountryRepositoryToken = 'CountryRepositoryToken';
export interface CountryRepository {
  search(searchCountryDTO: SearchCountryDTO): Promise<Country[]>;
}

export type SearchCountryDTO = {
  searchTerm?: string;
};
