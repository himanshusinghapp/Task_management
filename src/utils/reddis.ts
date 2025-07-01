import Redis from 'ioredis';

export class RedisUtil {
  private static client = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +(process.env.REDIS_PORT || 6379),
  });

  static get(key: string) {
    return this.client.get(key);
  }
  static set(key: string, value: string, ...args: any[]) {
    return this.client.set(key, value, ...args);
  }
  static del(key: string) {
    return this.client.del(key);
  }
  // Add other redis methods as needed
}
