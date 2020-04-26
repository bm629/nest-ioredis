/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import * as IORedis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectIORedisClient } from '../../src';

/**
 * @class
 * @ignore
 */
@Injectable()
export class DefaultOptionsIORedisConnectionTest {
  constructor(@InjectIORedisClient() private readonly redisClient: IORedis.Redis) {}

  getRedisConnection() {
    return this.redisClient;
  }
}
