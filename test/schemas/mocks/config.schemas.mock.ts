import {
  AuthConfig,
  AwsConfig,
  CorsConfig,
  DatabaseConfig,
  GlobalConfiguration,
} from '../../../src/interfaces/configurations.interfaces'

/**
 * Mocks for portSchema
 */
export const mockValidPort: number = 3000

/**
 * Mock for an invalid port
 */
export const mockInvalidPort: string = '3000'

/**
 * Mocks for authConfigSchema
 */
export const mockValidAuthConfig: AuthConfig = {
  authType: 'oauth',
  oauthConfig: {
    clientId: 'client-id',
    domain: 'domain.com',
    audience: 'audience',
    userEmailNameProperty: 'email',
  },
  apidocsUsers: {
    user1: 'pass1',
  },
}

/**
 * Mock for an invalid AuthConfig
 */
export const mockInvalidAuthConfig: Record<string, any> = { ...mockValidAuthConfig, authType: undefined }

/**
 * Mocks for databaseConfigSchema
 */
export const mockValidDbConfig: DatabaseConfig = {
  host: 'localhost',
  username: 'user',
  password: 'password',
  port: 5432,
}

/**
 * Mock for an invalid DatabaseConfig
 */
export const mockInvalidDbConfigPort: Record<string, any> = { ...mockValidDbConfig, port: 99999 }

/**
 * Mocks for corsConfigSchema
 */
export const mockValidCorsConfig: CorsConfig = {
  domainsWhiteList: ['http://localhost:3000'],
}

/**
 * Mock for an invalid CorsConfig
 */
export const mockInvalidCorsConfig: Record<string, any> = { domainsWhiteList: [123] }

/**
 * Mock for a valid AwsConfig
 */
export const mockValidAwsConfig: AwsConfig = {
  region: 'us-east-1',
}

/**
 * Mocks for globalConfigurationSchema
 */
export const mockValidGlobalConfig: GlobalConfiguration = {
  PORT: 3000,
  SERVICE_NAME: 'skrull',
  ENVIRONMENT: 'local',
  AUTH_CONFIG: mockValidAuthConfig,
  DB_CONFIG: mockValidDbConfig,
  CORS_CONFIG: mockValidCorsConfig,
  AWS_CONFIG: mockValidAwsConfig,
  PG_CONFIG: {
    databaseName: 'skrull',
    connectionPoolSettings: {
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    },
    databaseSecretName: 'skrull/postgres/credentials'
  }
}

/**
 * Mocks for invalidGlobalConfiguration
 */
export const mockInvalidGlobalConfig: object = {}

