import { AwsConfig, GlobalConfiguration } from '../../src/interfaces/configurations.interfaces'
import { AwsStub, mockClient } from 'aws-sdk-client-mock'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'
import { ConfigService } from '@mercadoni/instaleap-utils'
import { InvalidConfigError, InitializationError } from '../../src/errors/configuration.errors'
import { mockInitializerInstances, mockConfigService } from './mocks/app.mocks'
import { mockLogger } from '../mocks/general.mock'
import { ResourceNotFoundError } from '../../src/errors/not-found.error'
import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  ServiceInputTypes,
  ServiceOutputTypes,
  SecretsManagerClientResolvedConfig
} from '@aws-sdk/client-secrets-manager'
import { SecretsService } from '../../src/services/secrets.service'
import { SecretValue, ServiceParams } from '../../src/interfaces/commons.interfaces'
import { awsConfigMock, mockGlobalConfig } from '../mocks/env.mock'

vi.mock('../../src/app', () => mockInitializerInstances)
vi.mock('@mercadoni/elementals/logger', () => mockLogger())

// Mock SecretsManagerClient from aws-sdk-client-mock
const secretsManagerMock: AwsStub<ServiceInputTypes, ServiceOutputTypes, SecretsManagerClientResolvedConfig> = mockClient(SecretsManagerClient)

describe('SecretsService', () => {
  let productionAwsConfig: AwsConfig
  let localMockConfigService: ConfigService<GlobalConfiguration>
  let testConfig: GlobalConfiguration

  beforeAll(() => {
    productionAwsConfig = {
      ...awsConfigMock,
      region: 'us-west-2',
      credentials: undefined
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    secretsManagerMock.reset()

    testConfig = {
      ...mockGlobalConfig,
      ENVIRONMENT: 'production',
      AWS_CONFIG: productionAwsConfig
    }

    localMockConfigService = {
      getConfig: vi.fn().mockReturnValue(testConfig)
    } as unknown as ConfigService<GlobalConfiguration>

    mockConfigService.getConfig.mockReturnValue(testConfig)

    delete SecretsService['instance']
  })

  describe('Initialization tests', () => {
    test('should throw InitializationError when config is not provided', () => {
      expect(() => {
        SecretsService.getInstance(null as unknown as ServiceParams)
      }).toThrow(InitializationError)
      
      expect(() => {
        SecretsService.getInstance(null as unknown as ServiceParams)
      }).toThrow('SecretsService requires an instance of ConfigService for initialization')
    })

    test('should throw InitializationError when configService is not provided', () => {
      expect(() => {
        SecretsService.getInstance({} as ServiceParams)
      }).toThrow(InitializationError)
      
      expect(() => {
        SecretsService.getInstance({} as ServiceParams)
      }).toThrow('SecretsService requires an instance of ConfigService for initialization')
    })

    test('should initialize with production config without credentials', () => {
      const secretsService: SecretsService = SecretsService.getInstance({ 
        configService: localMockConfigService 
      })

      expect(secretsService).toBeInstanceOf(SecretsService)
      expect(localMockConfigService.getConfig).toHaveBeenCalled()
    })

    test('should initialize with local environment and credentials', () => {
      const localConfig: GlobalConfiguration = {
        ...mockGlobalConfig,
        ENVIRONMENT: 'local',
        AWS_CONFIG: awsConfigMock
      }

      const localConfigService: ConfigService<GlobalConfiguration> = {
        getConfig: vi.fn().mockReturnValue(localConfig)
      } as unknown as ConfigService<GlobalConfiguration>

      delete SecretsService['instance']

      const secretsService: SecretsService = SecretsService.getInstance({ 
        configService: localConfigService 
      })

      expect(secretsService).toBeInstanceOf(SecretsService)
      expect(localConfigService.getConfig).toHaveBeenCalled()
    })
  })

  describe('retrieveSecret method', () => {
    let secretsService: SecretsService
    const secretName: string = 'my/secret'

    beforeEach(() => {
      secretsService = SecretsService.getInstance({ configService: localMockConfigService })
    })

    // ---------- Successful test cases ----------
    test.each([
      {
        description: 'should retrieve and parse a JSON object secret successfully',
        secretValue: { username: 'testUser', password: 'testPassword' },
        parseAsJson: true,
        expectedType: 'object'
      },
      {
        description: 'should handle complex secret objects with nested properties',
        secretValue: {
          database: {
            host: 'localhost',
            port: 5432,
            credentials: { username: 'admin', password: 'secret123' }
          },
          apiKeys: ['key1', 'key2', 'key3']
        },
        parseAsJson: true,
        expectedType: 'object'
      },
      {
        description: 'should retrieve string secret as raw string when parseAsJson=false',
        secretValue: 'sk-abc123xyz789',
        parseAsJson: false,
        expectedType: 'string'
      },
      {
        description: 'should retrieve JSON string secret when parseAsJson=true',
        secretValue: 'api-key-value',
        parseAsJson: true,
        expectedType: 'string',
        storeAsJson: true // This will wrap the string in JSON quotes
      },
      {
        description: 'should retrieve number secret when parseAsJson=true',
        secretValue: 5432,
        parseAsJson: true,
        expectedType: 'number'
      },
      {
        description: 'should retrieve decimal number secret when parseAsJson=true',
        secretValue: 3.14,
        parseAsJson: true,
        expectedType: 'number'
      },
      {
        description: 'should retrieve number as string when parseAsJson=false',
        secretValue: '5432',
        parseAsJson: false,
        expectedType: 'string'
      },
      {
        description: 'should retrieve true boolean secret when parseAsJson=true',
        secretValue: true,
        parseAsJson: true,
        expectedType: 'boolean'
      },
      {
        description: 'should retrieve false boolean secret when parseAsJson=true',
        secretValue: false,
        parseAsJson: true,
        expectedType: 'boolean'
      },
      {
        description: 'should retrieve boolean as string when parseAsJson=false',
        secretValue: 'true',
        parseAsJson: false,
        expectedType: 'string'
      },
      {
        description: 'should return invalid JSON as string when parseAsJson=false',
        secretValue: 'this is not valid json',
        parseAsJson: false,
        expectedType: 'string'
      }
    ])('$description', async ({ secretValue, parseAsJson, expectedType, storeAsJson = false }) => {
      let storedValue: string
      if (storeAsJson) {
        storedValue = JSON.stringify(secretValue)
      } else {
        storedValue = typeof secretValue === 'object' ? JSON.stringify(secretValue) : String(secretValue)
      }

      const mockResponse: GetSecretValueCommandOutput = {
        SecretString: storedValue,
        $metadata: {}
      }
      secretsManagerMock.on(GetSecretValueCommand, { SecretId: secretName }).resolves(mockResponse)

      const secret: SecretValue = await secretsService.retrieveSecret(secretName, parseAsJson)

      // Verify command was called correctly
      expect(secretsManagerMock.commandCalls(GetSecretValueCommand, {
        SecretId: secretName
      })).toHaveLength(1)
      // Verify result
      expect(secret).toEqual(secretValue)
      expect(typeof secret).toBe(expectedType)
    })

    // ---------- Error cases ----------
    test.each([
      {
        description: 'should throw ResourceNotFoundError when SecretString is undefined',
        secretString: undefined,
        errorType: ResourceNotFoundError,
        errorMessage: `SecretString not found or is empty for secret ID: ${secretName}.`
      },
      {
        description: 'should throw ResourceNotFoundError when SecretString is null',
        secretString: null,
        errorType: ResourceNotFoundError,
        errorMessage: `SecretString not found or is empty for secret ID: ${secretName}.`
      },
      {
        description: 'should throw ResourceNotFoundError when SecretString is empty',
        secretString: '',
        errorType: ResourceNotFoundError,
        errorMessage: `SecretString not found or is empty for secret ID: ${secretName}.`
      }
    ])('$description', async ({ secretString, errorType, errorMessage }) => {
      const mockResponse: GetSecretValueCommandOutput = {
        SecretString: secretString as any,
        $metadata: {}
      }

      secretsManagerMock.on(GetSecretValueCommand, { SecretId: secretName })
        .resolves(mockResponse)

      await expect(secretsService.retrieveSecret(secretName))
        .rejects.toThrow(errorType)
      await expect(secretsService.retrieveSecret(secretName))
        .rejects.toThrow(errorMessage)
    })

    // JSON parsing error cases
    test.each([
      {
        description: 'should throw InvalidConfigError when SecretString is not valid JSON and parseAsJson=true',
        secretString: 'this is not valid json',
        expectedError: `Failed to parse secret ${secretName} as JSON:`
      },
      {
        description: 'should throw InvalidConfigError when SecretString contains null value',
        secretString: 'null',
        expectedError: `Secret ${secretName} contains null value which is not allowed`
      }
    ])('$description', async ({ secretString, expectedError }) => {
      const mockResponse: GetSecretValueCommandOutput = {
        SecretString: secretString,
        $metadata: {}
      }

      secretsManagerMock.on(GetSecretValueCommand, { SecretId: secretName })
        .resolves(mockResponse)

      await expect(secretsService.retrieveSecret(secretName, true))
        .rejects.toThrow(InvalidConfigError)

      await expect(secretsService.retrieveSecret(secretName, true))
        .rejects.toThrow(expectedError)
    })

    // AWS SDK error cases
    test.each([
      {
        description: 'should re-throw AWS SDK ResourceNotFoundException',
        errorName: 'ResourceNotFoundException',
        errorMessage: 'Secret not found in AWS'
      },
      {
        description: 'should re-throw other AWS SDK errors',
        errorName: 'InternalServiceErrorException',
        errorMessage: 'Internal service error'
      }
    ])('$description', async ({ errorName, errorMessage }) => {
      const sdkError: Error = new Error(errorMessage)
      sdkError.name = errorName

      secretsManagerMock.on(GetSecretValueCommand, { SecretId: secretName })
        .rejects(sdkError)

      await expect(secretsService.retrieveSecret(secretName))
        .rejects.toThrow(errorMessage)

      try {
        await secretsService.retrieveSecret(secretName)
      } catch (error) {
        expect((error as Error).name).toBe(errorName)
      }
    })
  })
})
