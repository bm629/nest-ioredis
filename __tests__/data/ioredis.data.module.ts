import { Module } from '@nestjs/common';
import { DefaultAsyncOptionsProvider } from './ioredis-default-async-options.provider';
import { CustomAsyncOptionsProvider } from './ioredis-custom-async-options.provider';

/**
 * @class
 * @ignore
 */
@Module({
  providers: [DefaultAsyncOptionsProvider, CustomAsyncOptionsProvider],
  exports: [DefaultAsyncOptionsProvider, CustomAsyncOptionsProvider],
})
export class IORedisDataModule {}
