import { ConfigService } from '@mercadoni/instaleap-utils'
import { ExampleServices } from '../services/example.service'
import { GlobalConfiguration } from './configurations.interfaces'
import { PostgresService } from '../services/postgres.service'
import { SecretsService } from '../services/secrets.service'

/**
 * Defines the services that are available in the application execution.
 * @field postgresServices - An instance of the PostgresService, which is responsible for managing interactions
 * with the Postgres service. I.e, {
 *  connect: async () => { ... }
 * }
 * @field secretsService - An instance of the SecretsService, which is responsible for managing interactions
 * with the AWS Secrets Manager service. I.e, ñ{
 *  retrieveSecret: async (key: string) => { ... },
 *  cacheSecret: async (key: string, value: SecretValue) => { ... }
 * }
 * @field exampleService - An instance of the ExampleService, which provides example functionalities. I.e, {
 *  performExampleTask: async () => { ... }
 * }
 * @field configService - An instance of the ConfigService, which provides access to the application's
 * configuration settings. I.e, {
 *  getConfig: () => { ... },
 *  updateConfig: async (newConfig: Partial<GlobalConfiguration>) => { ... }
 * }
 */
export interface Services {
  postgresService: PostgresService
  secretsService: SecretsService
  exampleService: ExampleServices
  configService: ConfigService<GlobalConfiguration>
}

/**
 * Union type representing all possible values that can be retrieved from AWS Secrets Manager.
 * This type encompasses the various data types that secrets can contain after parsing.
 * If it's a string secrets (API keys, tokens, passwords, etc.), I.e, const apiKey: SecretValue = "sk-example-abc123xyz789"
 *
 * If it's a number secrets (ports, timeouts, limits, etc.), I.e, const port: SecretValue = 5432
 *
 * If it's a boolean secrets (feature flags, configuration switches, etc.), I.e, const featureEnabled: SecretValue = true
 *
 * If it's an object secrets (database configs, API credentials, complex settings, etc.), I.e, const dbConfig: SecretValue = {
 *   host: "example.com",
 *   username: "admin",
 *   password: "examplePassword1234",
 *   port: 5432
 * }
 */
export type SecretValue = string | number | boolean | object

/**
 * This interface defines the configuration for setting services.
 * @field configService - An instance of the ConfigService, which provides
 * access to the application's configuration settings. I.e,
 * ConfigService.getInstance<GlobalConfiguration>()
 */
export interface ServiceParams {
  configService: ConfigService<GlobalConfiguration>
}
