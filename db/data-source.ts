import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig = {
  migrations: ['dist/db/migrations/*.js'],
  //   cli: {
  //     migrationsDir: 'migrations',
  //   },
};
switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['dist/**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['dist/**/*.entity.js'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: ['dist/**/*.entity.js'],
      migrationsRun: true,
    });
    break;
  default:
    throw new Error('Unknown environment ');
}
export const dataSourceOptions: DataSourceOptions =
  dbConfig as DataSourceOptions;
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
