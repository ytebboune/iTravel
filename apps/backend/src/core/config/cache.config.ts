import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const cacheConfig: CacheModuleOptions = {
  store: redisStore,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  ttl: 60 * 60 * 24, // 24 heures
  max: 100, // nombre maximum d'éléments en cache
}; 