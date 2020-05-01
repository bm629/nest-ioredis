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

1. Import IORedis Module

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

2. import Database module in AppModule

```typescript
// app.module.ts

@Module({
  imports: [DatabaseModule],
  controllers: [CatsController],
  providers: [CatSevice],
})
export class AppModule {}
```

3. Inject Redis client

```typescript
// cat.service.ts

export class CatService {
  contructor(@InjectIORedisClient('cacheRedisClient') private readonly redisClient: IORedis.Redis) {}
}
```

For more information, see test cases. You can find details in the [`__tests__/`](https://github.com/bm629/nest-ioredis/tree/master/__tests__) folder of this repository.

## License

[MIT licensed](LICENSE).
