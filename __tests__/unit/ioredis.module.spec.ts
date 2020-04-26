import * as IORedis from 'ioredis';
import { TestingModule, Test } from '@nestjs/testing';
import { DefaultAsyncOptionsProvider, CustomAsyncOptionsProvider, IORedisDataModule } from '../data';
import { IORedisModuleOptions, IORedisModule } from '../../src';

jest.genMockFromModule('ioredis');
jest.mock('ioredis');

const MockIORedis: jest.Mock<any> = IORedis as any;

describe('IORedisModule', () => {
  afterAll(() => {
    jest.unmock('ioredis');
  });

  describe('#forRoot()', () => {
    afterEach(async () => {
      MockIORedis.mockClear();
    });

    test('IORedisModule Instance (without any parameters)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [IORedisModule.forRoot()],
      }).compile();

      const ioredisModule = module.get(IORedisModule);
      expect(ioredisModule).toBeInstanceOf(IORedisModule);
    });

    test('IORedisModule Instance (with parameters)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          IORedisModule.forRoot({
            connectionName: 'ModuleTest',
          }),
        ],
      }).compile();

      const ioredisModule = module.get(IORedisModule);
      expect(ioredisModule).toBeInstanceOf(IORedisModule);
    });

    test('Should have default providers if no parameters passed', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [IORedisModule.forRoot()],
      }).compile();

      const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
      expect(ioModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

      const ioredis = module.get(ioModuleRedisConnectionProvderName);
      expect(ioredis).toBeInstanceOf(MockIORedis);

      const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
      expect(options).toEqual({});
    });

    test('Should have providers if custom connection name passed', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          IORedisModule.forRoot({
            connectionName: 'ModuleClient',
          }),
        ],
      }).compile();

      const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
      expect(ioModuleRedisConnectionProvderName).toEqual('ModuleClientConnection');

      const ioredis = module.get(ioModuleRedisConnectionProvderName);
      expect(ioredis).toBeInstanceOf(MockIORedis);

      const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
      expect(options).toEqual({ connectionName: 'ModuleClient' });
    });
  });

  describe('#forRootAsync()', () => {
    describe('useFactory method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              useFactory: () => {
                return {};
              },
            }),
          ],
        }).compile();

        const ioredisModule = module.get(IORedisModule);
        expect(ioredisModule).toBeInstanceOf(IORedisModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              useFactory: () => {
                return {};
              },
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              connectionName: 'redisModuleTest1',
              useFactory: () => {
                return {
                  connectionName: 'redisModuleTest2',
                };
              },
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('redisModuleTest1Connection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'redisModuleTest1' });
      });
    });

    describe('useClass method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              useClass: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioredisModule = module.get(IORedisModule);
        expect(ioredisModule).toBeInstanceOf(IORedisModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              useClass: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              connectionName: 'redisModuleTest1',
              useClass: CustomAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('redisModuleTest1Connection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'redisModuleTest1' });
      });
    });

    describe('useExisiting method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              imports: [IORedisDataModule],
              useExisting: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioredisModule = module.get(IORedisModule);
        expect(ioredisModule).toBeInstanceOf(IORedisModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              imports: [IORedisDataModule],
              useExisting: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisModule.forRootAsync({
              imports: [IORedisDataModule],
              connectionName: 'redisModuleTest1',
              useExisting: CustomAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(ioModuleRedisConnectionProvderName).toEqual('redisModuleTest1Connection');

        const ioredis = module.get(ioModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'redisModuleTest1' });
      });
    });
  });
});
