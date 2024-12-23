import 'reflect-metadata';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import entities from './entities';

dotenv.config();

const options: DataSourceOptions = {
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'backend',
  password: process.env.DATABASE_PASSWORD ?? 'backend',
  database: process.env.DATABASE_NAME ?? 'backend',
  synchronize: false,
  logging: false,
  dropSchema: false,
  type: 'postgres',
  maxQueryExecutionTime: 1000,
  entities: [...entities],
  // descomentar si se van a usar migraciones o generarlas, despues volver a comentar
  // migrations: ['src/pages/api/databases/postgresql/migrations/*.ts'],
  extra: {
    connectionLimit: 10,
  },
};

const dataSource = new DataSource(options);

export const initializeDatabase = async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
};

export default dataSource;
