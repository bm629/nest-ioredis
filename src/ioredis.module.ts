import { DynamicModule, Module } from '@nestjs/common';
import { IORedisModuleOptions, IORedisModuleAsyncOptions } from './ioredis.interfaces';
import { IORedisCoreModule } from './ioredis-core.module';

/**
 * This module is used to register ioredis client which can be injectable to repositories
 *
 * @export
 * @class IORedisModule
 */
@Module({})
export class IORedisModule {
  /**
   * Register ioredis client synchronously
   *
   * @static
   * @param {IORedisModuleOptions} [options] - options to create ioredis client
   * @returns {DynamicModule} - module which can be provide ioredis client
   * @memberof IORedisModule
   */
  static forRoot(options?: IORedisModuleOptions): DynamicModule {
    return {
      module: IORedisModule,
      imports: [IORedisCoreModule.forRoot(options)],
    };
  }

  /**
   * Register ioredis client asynchronously
   *
   * @static
   * @param {IORedisModuleAsyncOptions} options - options to create ioredis client asynchronously
   * @returns {DynamicModule} - module which can be provide ioredis client
   * @memberof IORedisModule
   */
  static forRootAsync(options: IORedisModuleAsyncOptions): DynamicModule {
    return {
      module: IORedisModule,
      imports: [IORedisCoreModule.forRootAsync(options)],
    };
  }
}
