import {
  CountryRepository,
  SearchCountryDTO,
} from '../domain/repositories/country.repository';
import { Injectable } from '@nestjs/common';
import { CountryEntity } from '../../database/country.entity';
import { Country } from '../domain/entities/country.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CountryRepositoryImpl implements CountryRepository {
  constructor(private readonly datasource: DataSource) {}

  static toDomain(countryEntity: CountryEntity): Country {
    const user = new Country();
    user.code = countryEntity.code;
    user.name = countryEntity.name;
    user.createdAt = countryEntity.createdAt;
    user.updatedAt = countryEntity.updatedAt;
    user.deletedAt = countryEntity.deletedAt;

    return user;
  }

  async search(searchCountryDTO: SearchCountryDTO): Promise<Country[]> {
    const countries = await this.datasource.manager.find(CountryEntity);

    return countries.map((country) => CountryRepositoryImpl.toDomain(country));
  }
}
