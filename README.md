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
