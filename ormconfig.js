module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_SCHEMA,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/dist/migration/**/*.{js,ts}'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
  entities: [__dirname + '/dist/entity/*.{js,ts}'],
  migrationsRun: true,
  synchronize: true,
};
