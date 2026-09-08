import { config as loadDotenv, DotenvConfigOutput } from 'dotenv'
import {
  AWSConfiguration,
  ConfigService,
  ConfigServiceParams
} from '@mercadoni/instaleap-utils'
import { ExampleServices } from '../services/example.service'
import {
  GlobalConfiguration,
  RedisConfig
} from '../interfaces/configurations.interfaces'
import { globalConfigurationSchema } from '../schemas/config.schemas'
import { PostgresService } from '../services/postgres.service'
import { SecretsService } from '../services/secrets.service'
import { Services } from '../interfaces/commons.interfaces'

const dotenvResult: DotenvConfigOutput = loadDotenv()

/**
 * Loads all the services needed for the application
 * @returns An object with an instance for each service
 */
export async function load(): Promise<any> {
  const serviceName: string = process.env.SERVICE_NAME as string
  const environment: string = process.env.ENVIRONMENT as string
  const awsConfig: AWSConfiguration = JSON.parse(process.env.AWS_CONFIG || '{}')
  const defaultRedisConfig: RedisConfig = JSON.parse(
    process.env.REDIS_CONFIG || '{ "host": "localhost", "port": 6380 }'
  )

  // In deployed environments (ECS), use process.env directly
  // In local, use dotenv parsed values as fallback
  const systemVars: GlobalConfiguration =
    environment === 'local'
      ? (dotenvResult.parsed as unknown as GlobalConfiguration)
      : (process.env as unknown as GlobalConfiguration)

  const configServiceParams: ConfigServiceParams<GlobalConfiguration> = {
    serviceName,
    environment,
    schema: globalConfigurationSchema,
    awsConfig,
    systemVars,
    redisOptions: defaultRedisConfig
  }

  await ConfigService.initialize<GlobalConfiguration>(configServiceParams)

  const configService: ConfigService<GlobalConfiguration> =
    ConfigService.getInstance<GlobalConfiguration>()

  const services: Services = {
    configService,
    exampleService: ExampleServices.getInstance(),
    postgresService: PostgresService.getInstance({ configService }),
    secretsService: SecretsService.getInstance({ configService })
  }
  return services
}
