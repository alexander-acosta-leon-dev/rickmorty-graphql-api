import dotenv from 'dotenv';

// Load environment variables once, with debug disabled.
// Temporarily suppress console output so third-party tips/debug
// messages from the dotenv package don't pollute logs.
const _log = console.log;
const _info = console.info;
const _warn = console.warn;
try {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  dotenv.config({ debug: false });
} finally {
  console.log = _log;
  console.info = _info;
  console.warn = _warn;
}

// Export environment variables for type safety
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '4000',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: process.env.DATABASE_PORT || '5433',
  DATABASE_USER: process.env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
  DATABASE_NAME: process.env.DATABASE_NAME || 'rickmorty_db',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
};
