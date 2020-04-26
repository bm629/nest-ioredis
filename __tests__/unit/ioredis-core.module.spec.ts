import * as IORedis from 'ioredis';
import { TestingModule, Test } from '@nestjs/testing';
import { IORedisCoreModule } from '../../src/ioredis-core.module';
import { DefaultAsyncOptionsProvider, CustomAsyncOptionsProvider, IORedisDataModule } from '../data';
import { IORedisModuleOptions } from '../../src';

jest.genMockFromModule('ioredis');
jest.mock('ioredis');

const MockIORedis: jest.Mock<any> = IORedis as any;

describe('IORedisCoreModule', () => {
  afterAll(() => {
    jest.unmock('ioredis');
  });

  test('IORedisModule Close behaviour', async () => {
    const onModuleDestroySpy = jest.spyOn(IORedisCoreModule.prototype, 'onModuleDestroy');
    const module: TestingModule = await Test.createTestingModule({
      imports: [IORedisCoreModule.forRoot({})],
    }).compile();

    const ioredisCoreModule = module.get(IORedisCoreModule);
    await module.close();
    expect(ioredisCoreModule.onModuleDestroy).toHaveBeenCalledTimes(1);

    onModuleDestroySpy.mockClear();
  });

  describe('#forRoot()', () => {
    afterEach(async () => {
      MockIORedis.mockClear();
    });

    test('IORedisCoreModule Instance (without any parameters)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [IORedisCoreModule.forRoot()],
      }).compile();

      const ioredisCoreModule = module.get(IORedisCoreModule);
      expect(ioredisCoreModule).toBeInstanceOf(IORedisCoreModule);
    });

    test('IORedisCoreModule Instance (with parameters)', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          IORedisCoreModule.forRoot({
            connectionName: 'coreModuleTest',
          }),
        ],
      }).compile();

      const ioredisCoreModule = module.get(IORedisCoreModule);
      expect(ioredisCoreModule).toBeInstanceOf(IORedisCoreModule);
    });

    test('Should have default providers if no parameters passed', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [IORedisCoreModule.forRoot()],
      }).compile();

      const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
      expect(iocoreModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

      const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
      expect(ioredis).toBeInstanceOf(MockIORedis);

      const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
      expect(options).toEqual({});
    });

    test('Should have providers if custom connection name passed', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          IORedisCoreModule.forRoot({
            connectionName: 'coreModuleClient',
          }),
        ],
      }).compile();

      const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
      expect(iocoreModuleRedisConnectionProvderName).toEqual('coreModuleClientConnection');

      const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
      expect(ioredis).toBeInstanceOf(MockIORedis);

      const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
      expect(options).toEqual({ connectionName: 'coreModuleClient' });
    });
  });

  describe('#forRootAsync()', () => {
    describe('useFactory method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisCoreModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              useFactory: () => {
                return {};
              },
            }),
          ],
        }).compile();

        const ioredisCoreModule = module.get(IORedisCoreModule);
        expect(ioredisCoreModule).toBeInstanceOf(IORedisCoreModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              useFactory: () => {
                return {};
              },
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              connectionName: 'coreModuleTest1',
              useFactory: () => {
                return {
                  connectionName: 'coreModuleTest2',
                };
              },
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('coreModuleTest1Connection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'coreModuleTest1' });
      });
    });

    describe('useClass method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisCoreModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              useClass: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioredisCoreModule = module.get(IORedisCoreModule);
        expect(ioredisCoreModule).toBeInstanceOf(IORedisCoreModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              useClass: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              connectionName: 'coreModuleTest1',
              useClass: CustomAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('coreModuleTest1Connection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'coreModuleTest1' });
      });
    });

    describe('useExisiting method', () => {
      afterEach(async () => {
        MockIORedis.mockClear();
      });

      test('IORedisCoreModule Instance', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              imports: [IORedisDataModule],
              useExisting: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const ioredisCoreModule = module.get(IORedisCoreModule);
        expect(ioredisCoreModule).toBeInstanceOf(IORedisCoreModule);
      });

      test('Should have default providers if no connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              imports: [IORedisDataModule],
              useExisting: DefaultAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('IORedisClientConnection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({});
      });

      test('Should have providers if custom connection name passed', async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            IORedisCoreModule.forRootAsync({
              imports: [IORedisDataModule],
              connectionName: 'coreModuleTest1',
              useExisting: CustomAsyncOptionsProvider,
            }),
          ],
        }).compile();

        const iocoreModuleRedisConnectionProvderName = module.get('IORedisConnectionName');
        expect(iocoreModuleRedisConnectionProvderName).toEqual('coreModuleTest1Connection');

        const ioredis = module.get(iocoreModuleRedisConnectionProvderName);
        expect(ioredis).toBeInstanceOf(MockIORedis);

        const options: IORedisModuleOptions = MockIORedis.mock.calls[0][0];
        expect(options).toEqual({ connectionName: 'coreModuleTest1' });
      });
    });
  });
});
