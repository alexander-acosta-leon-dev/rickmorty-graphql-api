import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { env } from '../config/env';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DATABASE_HOST,
  port: Number(env.DATABASE_PORT),
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  models: [path.join(__dirname, '../models')],
  logging: false,
});
