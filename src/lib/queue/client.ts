import Redis from 'ioredis';

const globalForRedis = globalThis as typeof globalThis & { vectroyRedis?: Redis };

export const connection =
  globalForRedis.vectroyRedis ??
  (globalForRedis.vectroyRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  }));
