import {
  AuthConfig,
  AwsConfig,
  CorsConfig,
  DatabaseConfig,
  GlobalConfiguration,
  PGConfig,
  RedisConfig
} from '../interfaces/configurations.interfaces'
import { JSONSchemaType } from 'ajv'

/* JSON schema for the port. */
export const portSchema: JSONSchemaType<number> = {
  type: 'number',
  'x-source': 'system'
}

/**
 * JSON Schema for Redis configuration
 */
export const RedisConfigSchema: JSONSchemaType<RedisConfig> = {
  type: 'object',
  'x-source': 'system',
  additionalProperties: false,
  properties: {
    host: { type: 'string' },
    port: { type: 'integer' }
  },
  required: ['host', 'port']
}

// Schema used to validate the config of the oauth service.
export const authConfigSchema: JSONSchemaType<AuthConfig> = {
  type: 'object',
  'x-source': 'system',
  additionalProperties: false,
  properties: {
    authType: {
      type: 'string'
    },
    oauthConfig: {
      type: 'object',
      additionalProperties: false,
      properties: {
        clientId: {
          type: 'string'
        },
        domain: {
          type: 'string'
        },
        audience: {
          type: 'string'
        },
        userEmailNameProperty: {
          type: 'string'
        }
      },
      required: ['clientId', 'domain', 'audience', 'userEmailNameProperty']
    },
    apidocsUsers: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      },
      required: []
    }
  },
  required: ['authType', 'oauthConfig', 'apidocsUsers']
}

/**
 * JSON Schema for database configuration
 */
export const databaseConfigSchema: JSONSchemaType<DatabaseConfig> = {
  type: 'object',
  'x-source': 'system',
  additionalProperties: true,
  properties: {
    host: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
    port: {
      type: 'integer',
      minimum: 1,
      maximum: 65535
    },
    dbInstanceIdentifier: { type: 'string', nullable: true }
  },
  required: ['host', 'username', 'password', 'port']
}

// JSON Shema for validation of configuration of PG
export const pgConfigSchema: JSONSchemaType<PGConfig> = {
  $id: 'skrull/schemas/config/pg',
  type: 'object',
  'x-source': 'system',
  additionalProperties: false,
  properties: {
    databaseName: { type: 'string' },
    connectionPoolSettings: {
      type: 'object',
      properties: {
        max: { type: 'number' },
        idleTimeoutMillis: { type: 'number' },
        connectionTimeoutMillis: { type: 'number' }
      },
      required: ['max', 'idleTimeoutMillis', 'connectionTimeoutMillis']
    },
    databaseSecretName: { type: 'string' }
  },
  required: ['databaseName', 'connectionPoolSettings', 'databaseSecretName']
}

/**
 * JSON Schema for cors configuration
 */
export const corsConfigSchema: JSONSchemaType<CorsConfig> = {
  type: 'object',
  'x-source': 'system',
  additionalProperties: false,
  properties: {
    domainsWhiteList: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  required: ['domainsWhiteList']
}

/**
 * JSON Schema to validate aws configuration realated to services like Secrets Manager.
 */
export const awsConfigSchema: JSONSchemaType<AwsConfig> = {
  $id: 'skrull/schemas/config/aws',
  'x-source': 'system',
  type: 'object',
  additionalProperties: false,
  properties: {
    region: { type: 'string' },
    credentials: {
      type: 'object',
      additionalProperties: false,
      nullable: true,
      properties: {
        accessKeyId: { type: 'string' },
        secretAccessKey: { type: 'string' }
      },
      required: ['accessKeyId', 'secretAccessKey']
    }
  },
  required: ['region']
}

/**
 * JSON Schema for global configuration
 */
export const globalConfigurationSchema: JSONSchemaType<GlobalConfiguration> = {
  type: 'object',
  additionalProperties: true,
  properties: {
    PORT: portSchema,
    ENVIRONMENT: {
      type: 'string',
      'x-source': 'system',
      enum: ['local', 'vormir', 'production', 'xandar']
    },
    SERVICE_NAME: {
      type: 'string',
      'x-source': 'system'
    },
    AUTH_CONFIG: authConfigSchema,
    DB_CONFIG: databaseConfigSchema,
    CORS_CONFIG: corsConfigSchema,
    PG_CONFIG: pgConfigSchema,
    AWS_CONFIG: awsConfigSchema
  },
  required: [
    'PORT',
    'SERVICE_NAME',
    'ENVIRONMENT',
    'DB_CONFIG',
    'PG_CONFIG',
    'AWS_CONFIG',
    'CORS_CONFIG',
    'AUTH_CONFIG'
  ]
}

/**
 * JSON Schema for partial configuration updates.
 * Allows updating one or more configuration properties without requiring all of them.
 * Validates that only valid configuration keys are provided.
 * Requires at least one property to be present (no empty objects allowed).
 */
export const partialConfigurationSchema: JSONSchemaType<
  Partial<GlobalConfiguration>
> = {
  type: 'object',
  additionalProperties: false,
  minProperties: 1,
  properties: {
    PORT: { ...portSchema, nullable: true },
    ENVIRONMENT: {
      type: 'string',
      'x-source': 'system',
      enum: ['local', 'vormir', 'production', 'xandar'],
      nullable: true
    },
    SERVICE_NAME: {
      type: 'string',
      'x-source': 'system',
      nullable: true
    },
    AUTH_CONFIG: { ...authConfigSchema, nullable: true },
    DB_CONFIG: { ...databaseConfigSchema, nullable: true },
    CORS_CONFIG: { ...corsConfigSchema, nullable: true },
    PG_CONFIG: { ...pgConfigSchema, nullable: true },
    AWS_CONFIG: { ...awsConfigSchema, nullable: true }
  },
  required: []
}
