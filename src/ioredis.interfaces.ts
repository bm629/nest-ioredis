import { RedisOptions } from 'ioredis';
import { DynamicModule, Type, Provider } from '@nestjs/common';

/**
 * intrface defining properties are used to create ioredis client synchronously
 *
 * Checkout ioredis [API Documentation]{@link https://github.com/luin/ioredis/blob/master/API.md} for more details
 * @export
 * @interface IORedisModuleOptions
 * @extends {RedisOptions}
 */
export interface IORedisModuleOptions extends RedisOptions {}

/**
 * interface use to create factory which provides {@link IORedisModuleOptions} asynchronously
 *
 * @export
 * @interface IORedisOptionsFactory
 */
export interface IORedisOptionsFactory {
  /**
   * this method must be overirded by factory call which provide {@link IORedisModuleOptions}
   * synchronously/asynchronously
   *
   * @returns {(Promise<IORedisModuleOptions> | IORedisModuleOptions)} - ioredis connection options
   * @memberof IORedisOptionsFactory
   */
  createIORedisOptions(): Promise<IORedisModuleOptions> | IORedisModuleOptions;
}

/**
 *
 * intrface defining properties are used to create ioredis client asynchronously
 * @export
 * @interface IORedisModuleAsyncOptions
 * @extends {Pick<DynamicModule, 'imports'>}
 */
export interface IORedisModuleAsyncOptions extends Pick<DynamicModule, 'imports'> {
  /**
   * IORedis connection name
   *
   * @type {string}
   * @memberof IORedisModuleAsyncOptions
   */
  connectionName?: string;

  /**
   * Provider to be aliased by the Injection token.
   *
   * @type {Type<IORedisOptionsFactory>}
   * @memberof IORedisModuleAsyncOptions
   */
  useExisting?: Type<IORedisOptionsFactory>;

  /**
   * Type of {@link IORedisOptionsFactory} provider (instance to be injected).
   *
   * @type {Type<IORedisOptionsFactory>}
   * @memberof IORedisModuleAsyncOptions
   */
  useClass?: Type<IORedisOptionsFactory>;

  /**
   * Factory function that returns an instance of {@link IORedisModuleOptions} that to be injected.
   *
   * @memberof IORedisModuleAsyncOptions
   */
  useFactory?: (...args: any[]) => Promise<IORedisModuleOptions> | IORedisModuleOptions;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   *
   * @type {any[]}
   * @memberof IORedisModuleAsyncOptions
   */
  inject?: any[];
}

/**
 * private interface used by {@link IORedisCoreModule} to store both ioredis client connectionName
 * and prover which will provide this connection name
 *
 * @export
 * @interface IORedisConnection
 */
export interface IORedisConnection {
  /**
   * stores the actual name for ioredis client
   *
   * @type {string}
   * @memberof IORedisConnection
   */
  ioredisConnectionName: string;

  /**
   * This is a provider which stores the value of redis client connection name
   *
   * @type {Provider<string>}
   * @memberof IORedisConnection
   */
  ioredisConnectionNameProvider: Provider<string>;
}
