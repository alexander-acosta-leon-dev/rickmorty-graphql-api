import 'reflect-metadata';
import './config/env'; // Load environment variables first
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { sequelize } from './db/sequelize';
import { schema } from './graphql';
import { connectRedis } from './services/redisService';
import { requestLogger } from './middleware/logger';
import { startCronJobs } from './services/cronJob';
import { env } from './config/env';

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await connectRedis();
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }

  const app = express();

  // Add request logging middleware
  app.use(requestLogger);

  const server = new ApolloServer({ schema });
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  const PORT = env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    startCronJobs();
  });
}

start().catch((err) => console.error(err));
