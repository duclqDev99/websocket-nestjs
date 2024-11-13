import { DataSource } from 'typeorm';
import { resolve } from 'path';
import { config } from 'dotenv';
config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [resolve('dist/**/*.entity.js')],
  migrations: [resolve('dist/migrations/*.js')],
  synchronize: false,
  logging: true,
  migrationsRun: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
