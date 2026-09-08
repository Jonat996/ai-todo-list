import { AuthConfig, AwsConfig, CorsConfig, DatabaseConfig, GlobalConfiguration, PGConfig } from '../../src/interfaces/configurations.interfaces'

/**
 * Mock for the authentication configuration.
 */
export const mockAuthConfig: AuthConfig = {
  authType: "OAUTH2.0",
  oauthConfig: {
    clientId: "6PAxTs6MkaBCqdVob",
    domain: "auth.support.example.io",
    audience: "https://coulson.example.io",
    userEmailNameProperty: "https://instaleap.io/email"
  },
  apidocsUsers: {
    support: "lOWnYhOnanTIAmYOuN"
  }
}

/**
 * Mock for the database configuration.
 */
export const mockDbConfig: DatabaseConfig = {
  username: "test",
  password: "testPassword",
  host: "localhost",
  port: 35432
}

/**
 * Mock for the CORS configuration.
 */
export const mockCorsConfig: CorsConfig = {
  domainsWhiteList: ["*"]
}

/**
 * Mock for pg environment variable.
 */
export const pgConfigMock: PGConfig = {
  databaseName: 'skrull',
  connectionPoolSettings: {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  databaseSecretName: 'skrull/postgres/credentials',
}

/**
 * Mock for AWS essential configuration.
 */
export const awsConfigMock: AwsConfig = {
  region: 'local',
  credentials: {
    accessKeyId: 'testAccessKeyId',
    secretAccessKey: 'testSecretAccessKey'
  }
}

/**
 * Mock for the global configuration.
 */
export const mockGlobalConfig: GlobalConfiguration = {
  PORT: 3000,
  ENVIRONMENT: 'local',
  AUTH_CONFIG: mockAuthConfig,
  DB_CONFIG: mockDbConfig,
  CORS_CONFIG: mockCorsConfig,
  AWS_CONFIG: awsConfigMock,
  PG_CONFIG: pgConfigMock,
  SERVICE_NAME: 'skrull'
}

/**
 * Parsed global configuration.
 */
export const parsedGlobalConfig: {
  parsed: {
    PORT: string
    ENVIRONMENT: string
    SERVICE_NAME: string
    AUTH_CONFIG: string
    DB_CONFIG: string
    CORS_CONFIG: string
    PG_CONFIG: string
    AWS_CONFIG: string
    REDIS_CONFIG: string
  }
  error: undefined
} = {
  parsed: {
    PORT: '3000',
    ENVIRONMENT: 'local',
    SERVICE_NAME: 'skrull',
    AUTH_CONFIG: JSON.stringify({ authType: 'oauth' }),
    DB_CONFIG: JSON.stringify({ host: 'localhost' }),
    CORS_CONFIG: JSON.stringify({ domainsWhiteList: [] }),
    PG_CONFIG: JSON.stringify({ databaseName: 'test' }),
    AWS_CONFIG: JSON.stringify({ region: 'us-east-1' }),
    REDIS_CONFIG: JSON.stringify({ host: 'localhost', port: 6380 })
  },
  error: undefined
}