import { Inject } from '@nestjs/common';

import { getIORedisConnectionToken } from './ioredis.utils';

/**
 * This decorator is used to inject Redis client
 *
 * @param {string} [name] - connectionName used while creating redis client
 */
export const InjectIORedisClient = (name?: string) => Inject(getIORedisConnectionToken(name));
