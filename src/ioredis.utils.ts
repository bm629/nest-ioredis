import { DEFAULT_IOREDIS_CLIENT_CONNECTION } from './ioredis.constants';

/**
 * This function is used to create ioredis connection provider name which will store the value of redis client
 *
 * @export
 * @param {string} [name] - connectionName used to create redis client which user will pass through ioredis options
 * @returns
 */
export function getIORedisConnectionToken(name?: string) {
  return name && name !== DEFAULT_IOREDIS_CLIENT_CONNECTION ? `${name}Connection` : DEFAULT_IOREDIS_CLIENT_CONNECTION;
}
