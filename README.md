[![npm version](https://badge.fury.io/js/%40bm629%2Fnest-ioredis.svg)](https://badge.fury.io/js/%40bm629%2Fnest-ioredis)
[![Coverage Status](https://coveralls.io/repos/github/bm629/nest-ioredis/badge.svg?branch=master)](https://coveralls.io/github/bm629/nest-ioredis?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/bm629/nest-ioredis.png?branch=master)](https://travis-ci.org/@bm629/nest-ioredis)

## Description

[IORedis](https://github.com/luin/ioredis) module for [Nest](https://github.com/nestjs/nest).

## Installation

```bash
$ npm i --save @bm629/nest-ioredis ioredis
```

## Usage

Import IORedis Module

```typescript
// database.module.ts

@Module({
  imports: [
    IORedisModule.forRoot({
      host: 'localhost',
      port: 6379,
      connectionName: 'cacheRedisClient',
    }),
  ],
})
@Global()
export class DatabaseModule {}
```

Import Database module in AppModule

```typescript
// app.module.ts

@Module({
  imports: [DatabaseModule],
  controllers: [CatsController],
  providers: [CatSevice],
})
export class AppModule {}
```

Inject Redis client

```typescript
// cat.service.ts

export class CatService {
  contructor(@InjectIORedisClient('cacheRedisClient') private readonly redisClient: IORedis.Redis) {}
}
```

## Async Options

Quite often you might want to asynchronously pass your module options instead of passing them beforehand. In such case, use forRootAsync() method, that provides a couple of various ways to deal with async data.

**1. Use factory**

```typescript
IORedisModule.forRootAsync({
  useFactory: () => ({
    host: 'localhost',
    port: 6379,
  }),
});
```

Obviously, our factory behaves like every other one (might be `async` and is able to inject dependencies through `inject`).

```typescript
IORedisModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    host: configService.getString('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
  }),
  inject: [ConfigService],
}),
```

**2. Use class**

```typescript
IORedisModule.forRootAsync({
  useClass: IORedisConfigService,
});
```

Above construction will instantiate `IORedisConfigService` inside `IORedisModule` and will leverage it to create options object.

```typescript
class IORedisConfigService implements IORedisOptionsFactory {
  createIORedisOptions(): IORedisModuleOptions {
    return {
      host: 'localhost',
      port: 6379,
    };
  }
}
```

**3. Use existing**

```typescript
IORedisModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
}),
```

It works the same as `useClass` with one critical difference - `IORedisModule` will lookup imported modules to reuse already created `ConfigService`, instead of instantiating it on its own.

**For more information, see test cases. You can find details in the [`__tests__/`](https://github.com/bm629/nest-ioredis/tree/master/__tests__) folder of this repository.**

## License

[MIT licensed](LICENSE).
