import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as csv from 'csv-parser';
import { join } from 'node:path';
import { createReadStream } from 'node:fs';
import { CountryEntity } from '../database/country.entity';

type Row = {
  Code: string;
  Name: string;
};

@Injectable()
export class SeederService {
  private logger = new Logger(SeederService.name);

  constructor(private readonly datasource: DataSource) {}

  async run() {
    // https://github.com/datasets/country-list/blob/main/data.csv
    const filePath = join(process.cwd(), './assets', 'country.csv');

    const countries: { code: string; name: string }[] = [];

    await new Promise<void>((resolve, reject) => {
      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: Row) => {
          countries.push({
            code: row['Code'],
            name: row['Name'],
          });
        })
        .on('end', () => {
          resolve();
        })
        .on('error', reject);
    });

    await this.datasource
      .createQueryBuilder()
      .insert()
      .into(CountryEntity)
      .values(countries)
      .orUpdate(['name'], ['code']) // ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
      .execute();

    this.logger.log(`✅ Seeded ${countries.length} countries`);
  }
}
