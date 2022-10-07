import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuth, Article, Comment, Tag } from 'db/entity';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;
const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  entities: [User, UserAuth, Article, Comment, Tag],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});

export const connectToDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};
