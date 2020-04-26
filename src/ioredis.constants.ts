/**
 * this constant used as provider name which stores the value of ioredis connection provider name
 * @type { string }
 * @constant
 */
export const IOREDIS_CONNECTION_NAME: string = 'IORedisConnectionName';

/**
 * this constant us used as provider default provider name which has ioredis client value
 * @type { string }
 * @constant
 */
export const DEFAULT_IOREDIS_CLIENT_CONNECTION: string = 'IORedisClientConnection';

/**
 * this constant is used as provider name which used to store {@link IORedisModuleOptions} options
 * its only used when options passed asynchronsaly
 * @type { string }
 * @constant
 */
export const IOREDIS_MODULE_OPTIONS: string = 'IORedisModuleOptions';
