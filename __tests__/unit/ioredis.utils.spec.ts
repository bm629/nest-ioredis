import { getIORedisConnectionToken } from '../../src';
import { DEFAULT_IOREDIS_CLIENT_CONNECTION } from '../../src/ioredis.constants';

describe('#getIORedisConnectionToken(connectionName?: string)', () => {
  test('should return default token if connection name is not provided', () => {
    expect(getIORedisConnectionToken()).toEqual(DEFAULT_IOREDIS_CLIENT_CONNECTION);
  });

  test('should return valid token name if connection name provided', () => {
    const inputConnectionName: string = 'userRedis';
    const expectedOutput = `${inputConnectionName}Connection`;
    expect(getIORedisConnectionToken(inputConnectionName)).toEqual(expectedOutput);
  });
});
