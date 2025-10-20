// Test environment setup
process.env.NODE_ENV = 'test';
process.env.DATABASE_HOST = 'localhost';
process.env.DATABASE_PORT = '5433';
process.env.DATABASE_USER = 'postgres';
process.env.DATABASE_PASSWORD = 'root';
process.env.DATABASE_NAME = 'rickmorty_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.PORT = '4001';

// Increase timeout for database operations
jest.setTimeout(30000);
