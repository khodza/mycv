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
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Unknown environment ');
}
export const dataSourceOptions: DataSourceOptions =
  dbConfig as DataSourceOptions;
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
