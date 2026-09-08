import { DatabaseConfig, PGConfig } from '../../src/interfaces/configurations.interfaces'
import { beforeEach, describe, expect, test, vi, Mock } from 'vitest'
import { connectionFailuresSet } from '../../src/mappings/postgres-error.map'
import { mockLogger, errorLoggerMock, infoLoggerMock } from '../mocks/general.mock'
import {
  mockRetrieveSecret,
  MockSecretsService,
  mockPgClient, 
  mockPgPool
} from './mocks/postgres.services'
import { mockInitializerInstances, mockConfigService } from './mocks/app.mocks'
import { mockGlobalConfig } from '../mocks/env.mock'
import { Pool } from 'pg'
import { InitializationError } from '../../src/errors/configuration.errors'
import { PoolConnectionError } from '../../src/errors/dependency.errors'
import { PostgresService } from '../../src/services/postgres.service'
import { ResourceNotFoundError } from '../../src/errors/not-found.error'
import { ServiceParams } from '../../src/interfaces/commons.interfaces'



vi.mock('pg', () => ({
  Pool: vi.fn(() => mockPgPool)
}))
vi.mock('@mercadoni/elementals/logger', () => mockLogger())
vi.mock('../../src/app', () => mockInitializerInstances)
vi.mock('../../src/services/secrets.service', () => ({
  SecretsService: MockSecretsService
}))

describe('Test suite for PostgresService class', () => {
  let postgresService: PostgresService
  const mockDbConfig: DatabaseConfig = mockGlobalConfig.DB_CONFIG
  const mockPgConfig: PGConfig = mockGlobalConfig.PG_CONFIG

  beforeEach(async () => {
    vi.clearAllMocks()
    PostgresService['instance'] = null

    mockRetrieveSecret.mockResolvedValue({
      username: 'refreshed_user',
      password: 'refreshed_password',
      host: 'refreshed_host',
      port: 1234
    })

    vi.mocked(Pool).mockImplementation(() => mockPgPool as unknown as Pool)

    mockPgPool.connect.mockClear().mockResolvedValue(mockPgClient)
    mockPgClient.query.mockReset()
    mockPgClient.release.mockClear()

    postgresService = PostgresService.getInstance({ configService: mockInitializerInstances.globalConfig })
  })

  describe('Test for PostgresService initialization', () => {
    test('should initialize Pool with correct config on first query', async () => {
      const mockRows: object[] = [{ test_value: 'test' }]
      mockPgClient.query.mockResolvedValue({ rows: mockRows })
      
      await postgresService.query('SELECT * FROM test')
      
      expect(Pool).toHaveBeenCalledTimes(1)
      expect(Pool).toHaveBeenCalledWith({
        user: mockDbConfig.username,
        host: mockDbConfig.host,
        database: mockPgConfig.databaseName,
        password: mockDbConfig.password,
        port: mockDbConfig.port,
        ...mockPgConfig.connectionPoolSettings
      })
    })

    test('should ensure only one initialization occurs when multiple queries are made concurrently', async () => {
      vi.mocked(Pool).mockClear()
      PostgresService['instance'] = null
      
      const slowQueryResponse = { rows: [{ test: 'data' }] }
      const delayedQueryMock = vi.fn().mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => resolve(slowQueryResponse), 50)
        })
      )
      
      const slowClient = {
        ...mockPgClient,
        query: delayedQueryMock,
        release: vi.fn()
      }
      
      mockPgPool.connect.mockResolvedValue(slowClient)
      
      const newService: PostgresService = PostgresService.getInstance({ configService: mockInitializerInstances.globalConfig })
      
      const query1: Promise<object[]> = newService.query('SELECT 1')
      const query2: Promise<object[]> = newService.query('SELECT 2')
      const query3: Promise<object[]> = newService.query('SELECT 3')
      
      await Promise.all([query1, query2, query3])
      
      expect(Pool).toHaveBeenCalledTimes(1)
    })

    test('should throw InitializationError when config is not provided', () => {
      PostgresService['instance'] = null
      
      expect(() => {
        PostgresService.getInstance(null as unknown as ServiceParams)
      }).toThrow(InitializationError)
      
      expect(() => {
        PostgresService.getInstance(null as unknown as ServiceParams)
      }).toThrow('PostgresService requires an instance of ConfigService for initialization')
    })

    test('should throw InitializationError when configService is not provided', () => {
      PostgresService['instance'] = null
      
      expect(() => {
        PostgresService.getInstance({} as ServiceParams)
      }).toThrow(InitializationError)
      
      expect(() => {
        PostgresService.getInstance({} as ServiceParams)
      }).toThrow('PostgresService requires an instance of ConfigService for initialization')
    })
  })

  describe('Test for query method', () => {
    test('should execute query successfully and convert keys to camelCase', async () => {
      mockPgPool.connect.mockClear()
      mockPgClient.query.mockClear()
      mockPgClient.release.mockClear()
      
      const mockRows: object[] = [{ first_name: 'Test', last_name: 'User', user_id: 1 }]
      mockPgClient.query.mockResolvedValue({ rows: mockRows })
      mockPgPool.connect.mockResolvedValue(mockPgClient)

      const queryResult: object[] = await postgresService.query('SELECT * FROM users')

      expect(mockPgPool.connect).toHaveBeenCalledTimes(2)
      expect(mockPgClient.query).toHaveBeenCalledWith('SELECT * FROM users', undefined)
      expect(mockPgClient.release).toHaveBeenCalledTimes(2)
      expect(queryResult).toEqual([{ firstName: 'Test', lastName: 'User', userId: 1 }])
    })

    test('should throw original error if not a recognized connection failure code', async () => {
      const genericDbError: Error = new Error('Generic DB error')
      Reflect.set(genericDbError, 'code', 'XX000')
      
      mockPgClient.query.mockResolvedValueOnce({ rows: [] })
      await postgresService.query('SELECT 1')
      
      mockPgClient.release.mockClear()
      mockPgClient.query.mockRejectedValueOnce(genericDbError)

      await expect(postgresService.query('SELECT 1')).rejects.toThrow('Generic DB error')
      expect(mockRetrieveSecret).not.toHaveBeenCalled()
      expect(mockPgClient.release).toHaveBeenCalledTimes(1)
    })

    test('should throw ResourceNotFoundError if secret retrieval fails during refresh', async () => {
      const authError: Error = new Error('Auth error')
      Reflect.set(authError, 'code', '28P01')
      mockPgClient.query.mockRejectedValueOnce(authError)

      const secretNotFoundError: ResourceNotFoundError = new ResourceNotFoundError('Secret not found in AWS', {})
      mockRetrieveSecret.mockRejectedValueOnce(secretNotFoundError)

      await expect(postgresService.query('SELECT 1')).rejects.toThrow(ResourceNotFoundError)
    })

    test('should throw InitializationError if new pool connection test fails during refresh', async () => {
      const authError: Error = new Error('Auth error')
      Reflect.set(authError, 'code', '28P01')
      const connectionTestError: Error = new Error('New pool connect test failed')
      const mockFailingPool: {
        connect: Mock
        end: Mock
      } = {
        connect: vi.fn().mockRejectedValue(connectionTestError),
        end: vi.fn().mockResolvedValue(undefined)
      }

      vi.mocked(Pool)
        .mockImplementationOnce(() => mockPgPool as unknown as Pool)
        .mockImplementationOnce(() => mockFailingPool as unknown as Pool)

      PostgresService['instance'] = null
      postgresService = PostgresService.getInstance({ configService: mockInitializerInstances.globalConfig })

      mockPgClient.query.mockRejectedValueOnce(authError)

      try {
        await postgresService.query('SELECT 1')
      } catch (error) {
        expect(error).toBeInstanceOf(PoolConnectionError)
      }

      expect(errorLoggerMock).toHaveBeenCalledWith(
        'Failed to refresh credentials and rebuild pool:',
        undefined,
        expect.any(PoolConnectionError)
      )
      expect(mockFailingPool.end).toHaveBeenCalledTimes(1)
    })

    test('should ensure only one refresh runs at a time', async () => {
      mockPgClient.query.mockClear()
      mockPgPool.connect.mockClear()
      
      mockPgClient.query.mockResolvedValue({ rows: [] })
      mockPgPool.connect.mockResolvedValue(mockPgClient)
      
      await postgresService.query('SELECT 1')
      
      let rejectSecretRetrieval: (error: Error) => void
      const slowSecretPromise: Promise<DatabaseConfig> = new Promise<DatabaseConfig>((resolve, reject) => {
        rejectSecretRetrieval = reject
      })
      
      mockRetrieveSecret.mockReset()
      mockRetrieveSecret.mockReturnValue(slowSecretPromise)

      const firstCall: Promise<void> = (postgresService as unknown as { refreshConnection: () => Promise<void> }).refreshConnection()
      const secondCall: Promise<void> = (postgresService as unknown as { refreshConnection: () => Promise<void> }).refreshConnection()

      expect(mockRetrieveSecret).toHaveBeenCalledTimes(1)
      
      let firstResolved: boolean = false
      let secondResolved: boolean = false
      
      firstCall.catch(() => { firstResolved = true })
      secondCall.catch(() => { secondResolved = true })

      rejectSecretRetrieval!(new Error('Test cleanup'))
      
      await Promise.allSettled([firstCall, secondCall])
      
      expect(firstResolved).toBe(true)
      expect(secondResolved).toBe(true)
    })

    test('should proactively rebuild pool when configuration changes are detected', async () => {
      mockPgPool.connect.mockClear()
      mockPgClient.query.mockClear()
      mockPgClient.release.mockClear()
      vi.mocked(Pool).mockClear()
      
      const mockRows: object[] = [{ test_value: 'initial' }]
      mockPgClient.query.mockResolvedValue({ rows: mockRows })
      mockPgPool.connect.mockResolvedValue(mockPgClient)

      await postgresService.query('SELECT * FROM test')

      expect(Pool).toHaveBeenCalledTimes(1)
      
      vi.mocked(Pool).mockClear()
      expect(infoLoggerMock).not.toHaveBeenCalledWith(
        expect.stringContaining('Proactive configuration change detected')
      )

      const updatedConfig: DatabaseConfig = {
        ...mockGlobalConfig.DB_CONFIG,
        host: 'new-host.example.com',
        port: 5433
      }
      mockConfigService.getConfig.mockReturnValue({
        ...mockGlobalConfig,
        DB_CONFIG: updatedConfig
      })

      await postgresService.query('SELECT * FROM test')

      expect(Pool).toHaveBeenCalledTimes(1)
      expect(infoLoggerMock).toHaveBeenCalledWith(
        'Proactive configuration change detected. Rebuilding pool...'
      )
    })

    test('should log an error if terminating the old pool fails but still succeed overall', async () => {
      const authError: Error = new Error('Auth error')
      Reflect.set(authError, 'code', '28P01')
      const oldPoolEndError: Error = new Error('Failed to close old pool')
      
      const mockClientInitialSuccess = {
        ...mockPgClient,
        query: vi.fn().mockResolvedValue({ rows: [] }),
        release: vi.fn()
      }
      
      const mockClientWithAuthError = {
        ...mockPgClient,
        query: vi.fn().mockRejectedValue(authError),
        release: vi.fn()
      }
      
      const mockOldPoolWithFailingEnd: {
        connect: Mock
        end: Mock
        _id: string
      } = {
        ...mockPgPool,
        connect: vi.fn()
          .mockResolvedValueOnce(mockClientInitialSuccess)
          .mockResolvedValueOnce(mockClientWithAuthError),
        end: vi.fn().mockRejectedValue(oldPoolEndError)
      }

      const mockClientSuccess = {
        ...mockPgClient,
        query: vi.fn().mockResolvedValue({ rows: [{ success: true }] }),
        release: vi.fn()
      }

      const mockNewSuccessfulPool: {
        connect: Mock
        end: Mock
        _id: string
      } = {
        ...mockPgPool,
        connect: vi.fn()
          .mockResolvedValueOnce(mockClientSuccess)
          .mockResolvedValue(mockClientSuccess),
        end: vi.fn().mockResolvedValue(undefined)
      }

      vi.mocked(Pool)
        .mockImplementationOnce(() => mockOldPoolWithFailingEnd as unknown as Pool)
        .mockImplementationOnce(() => mockNewSuccessfulPool as unknown as Pool)

      PostgresService['instance'] = null
      postgresService = PostgresService.getInstance({ configService: mockInitializerInstances.globalConfig })

      const result: object[] = await postgresService.query('SELECT 1')

      expect(result).toEqual([{ success: true }])
      expect(mockOldPoolWithFailingEnd.end).toHaveBeenCalledTimes(1)
      expect(errorLoggerMock).toHaveBeenCalledWith(
        'Failed to close old pool, but continuing with new pool',
        undefined,
        oldPoolEndError
      )
    })

    describe('with retryable error codes', () => {
      const retryableErrorCodes: string[] = Array.from(connectionFailuresSet)
      test.each(retryableErrorCodes)(
        'should trigger credential refresh and retry successfully for error code %s',
        async (errorCode: string) => {
          const connectionError: Error = new Error(`Simulated DB error with code ${errorCode}`)
          Reflect.set(connectionError, 'code', errorCode)
          const successRows: object[] = [{ product_name: 'Test Product', price_amount: 100 }]

          mockPgClient.query
            .mockRejectedValueOnce(connectionError)
            .mockResolvedValueOnce({ rows: successRows })

          const refreshedCredentials: DatabaseConfig = {
            username: `refreshed_user_${errorCode}`,
            password: `refreshed_password_${errorCode}`,
            host: `refreshed_host_${errorCode}`,
            port: 54321
          }
          mockRetrieveSecret.mockResolvedValue(refreshedCredentials)

          const queryResult: object[] = await postgresService.query('SELECT * FROM products WHERE id = 1')

          expect(mockRetrieveSecret).toHaveBeenCalledTimes(1)
          expect(mockPgClient.query).toHaveBeenCalledTimes(2)
          expect(queryResult).toEqual([{ productName: 'Test Product', priceAmount: 100 }])
          expect(infoLoggerMock).toHaveBeenCalledWith(
            expect.stringContaining(`Authentication error detected (Code: ${errorCode}). Attempting credential refresh`)
          )
        }
      )
    })
  })

  describe('Test for queryOne method', () => {
    test('should return the first row (camelCased) if query returns results', async () => {
      const mockRows: object[] = [{ id_val: 1, user_name: 'One' }, { id_val: 2, user_name: 'Two' }]
      mockPgClient.query.mockResolvedValue({ rows: mockRows })

      const queryResult: object = await postgresService.queryOne('SELECT *')

      expect(queryResult).toEqual({ idVal: 1, userName: 'One' })
    })

    test('should return undefined if query returns no results', async () => {
      mockPgClient.query.mockResolvedValue({ rows: [] })

      const queryResult: object = await postgresService.queryOne('SELECT *')

      expect(queryResult).toBeUndefined()
    })
  })

  describe('Test for executeNonQuery method', () => {
    test('should execute query and not expect specific rows', async () => {
      mockPgClient.query.mockResolvedValue({ rows: [] })

      await postgresService.executeNonQuery('DELETE FROM users WHERE id = $1', [1])

      expect(mockPgClient.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [1])
    })
  })

  describe('Test for close method', () => {
    test('should call pool.end to close all connections', async () => {
      mockPgClient.query.mockResolvedValue({ rows: [] })
      
      await postgresService.query('SELECT 1')
      await postgresService.close()

      expect(mockPgPool.end).toHaveBeenCalledTimes(1)
    })
  })
})
