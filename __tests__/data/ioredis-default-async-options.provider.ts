/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { IORedisOptionsFactory, IORedisModuleOptions } from '../../src';

/**
 * @ignore
 */
@Injectable()
export class DefaultAsyncOptionsProvider implements IORedisOptionsFactory {
  createIORedisOptions(): Promise<IORedisModuleOptions> | IORedisModuleOptions {
    return {};
  }
}
