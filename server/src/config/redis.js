/**
 * Shared BullMQ / ioredis connection options.
 * Prefer REDIS_URL (Upstash, Redis Cloud, etc.); fall back to REDIS_HOST/PORT.
 */
export const getRedisConnection = () => {
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);
    return {
      host: url.hostname,
      port: Number(url.port || (url.protocol === "rediss:" ? 6379 : 6379)),
      username: url.username || undefined,
      password: url.password || undefined,
      tls: url.protocol === "rediss:" ? {} : undefined,
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
};
