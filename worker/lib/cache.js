const IORedis = require('ioredis');

const redis = new IORedis(process.env.REDIS_URL);

async function get(key) {
  const v = await redis.get(key);
  if (!v) return null;
  try { return JSON.parse(v); } catch (e) { return v; }
}

async function set(key, value, ttlSeconds) {
  const v = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds) return redis.set(key, v, 'EX', ttlSeconds);
  return redis.set(key, v);
}

module.exports = {
  client: redis,
  get,
  set,
};
