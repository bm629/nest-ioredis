/* eslint-disable no-empty-function */
/* eslint-disable no-useless-constructor */
import * as IORedis from 'ioredis';
import { defer } from 'rxjs';
import { DynamicModule, Module, Global, Inject, Provider, OnModuleDestroy, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IOREDIS_CONNECTION_NAME, IOREDIS_MODULE_OPTIONS } from './ioredis.constants';
import {
  IORedisModuleOptions,
  IORedisConnection,
  IORedisModuleAsyncOptions,
  IORedisOptionsFactory,
} from './ioredis.interfaces';
import { getIORedisConnectionToken } from './ioredis.utils';

/**
 * This is internal module used by {@link IORedisModule} which actually creates ioredis client
 * and handle its lifecysle events
 *
 * @export
 * @class IORedisCoreModule
 * @implements {OnModuleDestroy}
 */
@Global()
@Module({})
export class IORedisCoreModule implements OnModuleDestroy {
  /**
   * Creates an instance of IORedisCoreModule.
   * @param {string} connectionName - redis client connection name
   * @param {ModuleRef} moduleRef - reference to metadata for this module
   * @memberof IORedisCoreModule
   */
  constructor(
    @Inject(IOREDIS_CONNECTION_NAME) private readonly connectionName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  /**
   * Register ioredis client synchronously
   *
   * @static
   * @param {IORedisModuleOptions} [options={}] - options to create ioredis client
   * @returns {DynamicModule} - module which can be provide ioredis client
   * @memberof IORedisCoreModule
   */
  static forRoot(options: IORedisModuleOptions = {}): DynamicModule {
    const {
      ioredisConnectionName,
      ioredisConnectionNameProvider,
    }: IORedisConnection = IORedisCoreModule.getIORedisConnectionNameAndNameProvider(options.connectionName);

    const ioredisConnectionProvider: Provider = {
      provide: ioredisConnectionName,
      useFactory: async (): Promise<IORedis.Redis> => defer(async () => new IORedis(options)).toPromise(),
    };

    return {
      module: IORedisCoreModule,
      providers: [ioredisConnectionNameProvider, ioredisConnectionProvider],
      exports: [ioredisConnectionProvider],
    };
  }

  /**
   * Register ioredis client asynchronously
   *
   * @static
   * @param {IORedisModuleAsyncOptions} asyncOptions - options to create ioredis client asynchronously
   * @returns {DynamicModule} - module which can be provide ioredis client
   * @memberof IORedisCoreModule
   */
  static forRootAsync(asyncOptions: IORedisModuleAsyncOptions): DynamicModule {
    const {
      ioredisConnectionName,
      ioredisConnectionNameProvider,
    }: IORedisConnection = IORedisCoreModule.getIORedisConnectionNameAndNameProvider(asyncOptions.connectionName);

    const ioredisConnectionProvider: Provider = {
      provide: ioredisConnectionName,
      useFactory: async (options: IORedisModuleOptions): Promise<IORedis.Redis> => {
        // eslint-disable-next-line no-param-reassign
        options.connectionName = asyncOptions.connectionName;
        return defer(async () => new IORedis(options)).toPromise();
      },
      inject: [IOREDIS_MODULE_OPTIONS],
    };

    const asyncProviders: Provider[] = this.createAsyncProviders(asyncOptions);

    return {
      module: IORedisCoreModule,
      imports: asyncOptions.imports,
      providers: [...asyncProviders, ioredisConnectionNameProvider, ioredisConnectionProvider],
      exports: [ioredisConnectionProvider],
    };
  }

  /**
   * This is lifecysle method called by nest framework on module destroy.
   * we close redis client connection here and free all resources
   *
   * @returns {Promise<void>}
   * @memberof IORedisCoreModule
   */
  async onModuleDestroy(): Promise<void> {
    const connection: IORedis.Redis = this.moduleRef.get<IORedis.Redis>(this.connectionName);
    connection.disconnect();
  }

  /**
   * provide details os actual connection name for ioredis client
   * along with provider which stores the value of this connection name
   *
   * @private
   * @static
   * @param {string} [connectionName] - connection name pass by user
   * @returns {IORedisConnection} - details of actual connection name and provider
   * @memberof IORedisCoreModule
   */
  private static getIORedisConnectionNameAndNameProvider(connectionName?: string): IORedisConnection {
    const ioredisConnectionName = getIORedisConnectionToken(connectionName);
    const ioredisConnectionNameProvider: Provider<string> = {
      provide: IOREDIS_CONNECTION_NAME,
      useValue: ioredisConnectionName,
    };
    return { ioredisConnectionName, ioredisConnectionNameProvider };
  }

  /**
   * This function is used to create async providers
   * which internally helps to get {@link IORedisModuleOptions} asynchronously
   *
   * @private
   * @static
   * @param {IORedisModuleAsyncOptions} asyncOptions - async options provided by user
   * @returns {Provider[]} - list of providers which provide {@link IORedisModuleOptions} asynchronously
   * @memberof IORedisCoreModule
   */
  private static createAsyncProviders(asyncOptions: IORedisModuleAsyncOptions): Provider[] {
    const providers: Provider[] = [this.createIORedisModuleOptionsProvider(asyncOptions)];

    if (asyncOptions.useClass) {
      const useClass = asyncOptions.useClass as Type<IORedisOptionsFactory>;
      providers.push({ provide: useClass, useClass });
    }
    return providers;
  }

  /**
   * This function is used to create actual option provider
   * which will be injected in creating redis client asynchronously
   *
   * @private
   * @static
   * @param {IORedisModuleAsyncOptions} asyncOptions - async options provided by user
   * @returns {Provider} - provider for {@link IORedisModuleOptions}
   * @memberof IORedisCoreModule
   */
  private static createIORedisModuleOptionsProvider(asyncOptions: IORedisModuleAsyncOptions): Provider {
    if (asyncOptions.useFactory) {
      return {
        provide: IOREDIS_MODULE_OPTIONS,
        useFactory: asyncOptions.useFactory,
        inject: asyncOptions.inject || [],
      };
    }

    const inject = [(asyncOptions.useClass || asyncOptions.useExisting) as Type<IORedisOptionsFactory>];
    return {
      provide: IOREDIS_MODULE_OPTIONS,
      useFactory: async (optionFactory: IORedisOptionsFactory) => optionFactory.createIORedisOptions(),
      inject,
    };
  }
}
