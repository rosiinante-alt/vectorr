import Redis from 'ioredis';

const globalForRedis = globalThis as typeof globalThis & { vectorrRedis?: Redis };

export const connection =
  globalForRedis.vectorrRedis ??
  (globalForRedis.vectorrRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  }));
