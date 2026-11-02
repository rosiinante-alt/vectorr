import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
});

redis.on('error', () => undefined);

redis
  .ping()
  .then(() => {
    console.log('Redis connected');
    redis.disconnect();
  })
  .catch((error: unknown) => {
    console.error('Redis connection failed:', error);
    if (redis.status !== 'end') redis.disconnect();
    process.exitCode = 1;
  });
