import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): Partial<TypeOrmModuleOptions> => {
  console.log(process.env.NODE_ENV);

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
  };
};
