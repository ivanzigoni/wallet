export default {
  DB_PORT: +process.env.DB_PORT || 5432,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'schema',
  APP_PORT: process.env.APP_PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || '',
};
