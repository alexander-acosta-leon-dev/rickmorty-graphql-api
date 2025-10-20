import { createClient } from 'redis';
import { env } from '../config/env';

const client = createClient({
  url: env.REDIS_URL,
});

client.on('error', (err) => {
  console.error('[ERROR] Redis client error:', err.message);
});

client.on('connect', () => {
  console.log('[INFO] Redis connection established successfully');
});

export const connectRedis = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('[ERROR] Redis connection failed:', error);
  }
};

export const redisCache = {
  async get(key: string): Promise<string | null> {
    try {
      return await client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  async set(key: string, value: string, expireInSeconds: number = 300): Promise<void> {
    try {
      await client.setEx(key, expireInSeconds, value);
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Redis DELETE error:', error);
    }
  },
};
