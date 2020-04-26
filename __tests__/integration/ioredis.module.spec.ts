/* eslint-disable import/first */

import * as IORedis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { IORedisModule, IORedisModuleOptions } from '../../src';
import { CustomOptionsIORedisConnectionTest, DefaultOptionsIORedisConnectionTest } from '../data';

jest.genMockFromModule('ioredis');
jest.mock('ioredis');

const MockIORedis: jest.Mock<any> = IORedis as any;

describe('IORedisModule', () => {
  afterEach(async () => {
    MockIORedis.mockClear();
  });

  test('Instantiate IORedisModule without any options', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IORedisModule.forRoot()],
      providers: [DefaultOptionsIORedisConnectionTest],
    }).compile();

    const testConnection: DefaultOptionsIORedisConnectionTest = module.get(DefaultOptionsIORedisConnectionTest);
    expect(testConnection).toBeInstanceOf(DefaultOptionsIORedisConnectionTest);
    expect(testConnection.getRedisConnection()).toBeInstanceOf(MockIORedis);

    const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
    expect(options).toEqual({});
  });

  test('Instantiate IORedisModule with options', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IORedisModule.forRoot({ connectionName: 'redisClient' })],
      providers: [CustomOptionsIORedisConnectionTest],
    }).compile();

    const testConnection: CustomOptionsIORedisConnectionTest = module.get(CustomOptionsIORedisConnectionTest);
    expect(testConnection).toBeInstanceOf(CustomOptionsIORedisConnectionTest);
    expect(testConnection.getRedisConnection()).toBeInstanceOf(MockIORedis);

    const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
    expect(options).toEqual({ connectionName: 'redisClient' });
  });
});
