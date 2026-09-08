import { mockGlobalConfig, parsedGlobalConfig } from '../mocks/env.mock'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { load as loadServices } from '../../src/loaders/services.loader'
import { Services } from '../../src/interfaces/commons.interfaces'
import { ConfigServiceParams } from '@mercadoni/instaleap-utils'
import { GlobalConfiguration } from '../../src/interfaces/configurations.interfaces'


// Set up environment variables before any imports
process.env.SERVICE_NAME = 'skrull'
process.env.ENVIRONMENT = 'local'
process.env.AWS_CONFIG = JSON.stringify({ region: 'us-east-1' })
process.env.REDIS_CONFIG = JSON.stringify({ host: 'localhost', port: 6380 })

// Mock dotenv to return parsed config in local environment
vi.mock('dotenv', () => ({
  config: vi.fn(() => (parsedGlobalConfig))
}))

// Mock the ConfigService to avoid real initialization
vi.mock('@mercadoni/instaleap-utils', async () => {
  const actual: typeof import('@mercadoni/instaleap-utils') = await vi.importActual('@mercadoni/instaleap-utils')
  return {
    ...actual,
    ConfigService: {
      initialize: vi.fn().mockResolvedValue(undefined),
      getInstance: vi.fn(() => ({
        getConfig: vi.fn().mockReturnValue(mockGlobalConfig),
        updateConfig: vi.fn().mockResolvedValue(undefined)
      }))
    }
  }
})

// Mock the PostgresService to avoid creating a real instance
vi.mock('../../src/services/postgres.service', () => ({
  PostgresService: {
    getInstance: vi.fn(() => ({
      init: vi.fn(),
      query: vi.fn(),
      close: vi.fn()
    }))
  }
}))

// Mock the SecretsService to avoid creating a real instance
vi.mock('../../src/services/secrets.service', () => ({
  SecretsService: {
    getInstance: vi.fn(() => ({
      init: vi.fn(),
      retrieveSecret: vi.fn()
    }))
  }
}))

// Mock the ExampleServices to avoid creating a real instance
vi.mock('../../src/services/example.service', () => ({
  ExampleServices: {
    getInstance: vi.fn(() => ({
      exampleMethod: vi.fn()
    }))
  }
}))

describe('Test for the ServicesLoader class', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure environment variables are set for each test
    process.env.SERVICE_NAME = 'skrull'
    process.env.ENVIRONMENT = 'local'
    process.env.AWS_CONFIG = JSON.stringify({ region: 'us-east-1' })
    process.env.REDIS_CONFIG = JSON.stringify({ host: 'localhost', port: 6380 })
  })

  test('should be a function', () => {
    expect(typeof loadServices).toBe('function')
  })

  test('should return a promise', () => {
    expect(loadServices()).toBeInstanceOf(Promise)
  })

  test('should resolve to an object', async () => {
    const services: Services = await loadServices()
    expect(typeof services).toBe('object')
    expect(services).not.toBeNull()
  })

  test('should resolve to an object containing all services', async () => {
    const services: Services = await loadServices()
    expect(Object.keys(services).length).toBe(4)
    expect(services).toHaveProperty('configService')
    expect(services).toHaveProperty('postgresService')
    expect(services).toHaveProperty('secretsService')
    expect(services).toHaveProperty('exampleService')
  })

  test('should initialize ConfigService with correct parameters', async () => {
    const { ConfigService } = await import('@mercadoni/instaleap-utils')
    
    await loadServices()

    expect(ConfigService.initialize).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceName: expect.any(String),
        environment: expect.any(String),
        schema: expect.any(Object),
        awsConfig: expect.any(Object),
        systemVars: expect.any(Object),
        redisOptions: expect.any(Object)
      })
    )
  })

  test('should call getInstance on all service singletons', async () => {
    const { ConfigService } = await import('@mercadoni/instaleap-utils')
    const { PostgresService } = await import('../../src/services/postgres.service')
    const { SecretsService } = await import('../../src/services/secrets.service')
    const { ExampleServices } = await import('../../src/services/example.service')

    await loadServices()

    expect(ConfigService.getInstance).toHaveBeenCalled()
    expect(PostgresService.getInstance).toHaveBeenCalled()
    expect(SecretsService.getInstance).toHaveBeenCalled()
    expect(ExampleServices.getInstance).toHaveBeenCalled()
  })

  test('should use dotenv parsed values when environment is local', async () => {
    const { ConfigService } = await import('@mercadoni/instaleap-utils')
    
    // Ensure environment is 'local'
    process.env.ENVIRONMENT = 'local'
    
    await loadServices()

    const callArgs: ConfigServiceParams<GlobalConfiguration> = (ConfigService.initialize as any).mock.calls[0][0]
    // In local environment, systemVars should come from dotenv.parsed
    expect(callArgs.systemVars).toBeDefined()
    expect(callArgs.environment).toBe('local')
  })

  test('should use process.env when environment is not local', async () => {
    const { ConfigService } = await import('@mercadoni/instaleap-utils')
    
    // Set environment to something other than 'local'
    process.env.ENVIRONMENT = 'vormir'
    process.env.PORT = '80'
    process.env.AUTH_CONFIG = JSON.stringify({ authType: 'oauth' })
    process.env.DB_CONFIG = JSON.stringify({ host: 'prod-db' })
    process.env.CORS_CONFIG = JSON.stringify({ domainsWhiteList: ['https://prod.com'] })
    process.env.PG_CONFIG = JSON.stringify({ databaseName: 'prod' })
    
    await loadServices()

    const callArgs: ConfigServiceParams<GlobalConfiguration> = (ConfigService.initialize as any).mock.calls[0][0]
    // In deployed environments, systemVars should be process.env
    expect(callArgs.environment).toBe('vormir')
    expect(callArgs.systemVars).toBe(process.env)
  })
})
