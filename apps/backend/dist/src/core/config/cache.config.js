"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheConfig = void 0;
const cache_manager_redis_store_1 = require("cache-manager-redis-store");
exports.cacheConfig = {
    store: cache_manager_redis_store_1.redisStore,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    ttl: 60 * 60 * 24,
    max: 100,
};
//# sourceMappingURL=cache.config.js.map