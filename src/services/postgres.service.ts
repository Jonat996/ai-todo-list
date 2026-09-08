import logger from '@mercadoni/elementals/logger'
import { camelCase } from 'lodash'
import { ConfigService, createSingleton } from '@mercadoni/instaleap-utils'
import { connectionFailuresSet } from '../mappings/postgres-error.map'
import {
  DatabaseConfig,
  GlobalConfiguration,
  PGConfig
} from '../interfaces/configurations.interfaces'
import { InitializationError } from '../errors/configuration.errors'
import { Pool, PoolClient, QueryResult } from 'pg'
import { PoolConnectionError } from '../errors/dependency.errors'
import { SecretsService } from '../services/secrets.service'
import { ServiceParams } from '../interfaces/commons.interfaces'

export class PostgresService extends createSingleton<PostgresService>() {
  private readonly configService: ConfigService<GlobalConfiguration>
  private pool!: Pool
  private activePoolConfigSignature: string = ''
  private refreshPromise: Promise<void> | null = null
  private initializationPromise: Promise<void> | null = null

  /**
   * Initializes the PostgresService singleton.
   * The connection pool is created lazily on first use.
   * This service uses lazy credential refreshing and connection pool rebuilding,
   * triggered automatically on authentication failures.
   */
  private constructor(config: ServiceParams) {
    super()
    if (!config?.configService) {
      throw new InitializationError(
        'PostgresService requires an instance of ConfigService for initialization'
      )
    }
    this.configService = config.configService
  }

  /**
   * Ensures the pool is initialized before use.
   * This method is called automatically by all public methods.
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise
    }
    if (this.pool) {
      return
    }
    this.initializationPromise = this.rebuildPool().finally(() => {
      this.initializationPromise = null
    })
    return this.initializationPromise
  }

  /**
   * Creates and validates a new connection pool.
   * @returns A Promise that resolves to the created Pool instance. I.e,
   * Pool { totalCount: 0, idleCount: 0, waitingCount: 0 }
   */
  private async createAndValidatePool(): Promise<Pool> {
    const dbConfig: DatabaseConfig = this.configService.getConfig().DB_CONFIG
    const pgConfig: PGConfig = this.configService.getConfig().PG_CONFIG

    logger('PostgresService').info('Creating a new connection pool...', {
      host: dbConfig.host,
      db: pgConfig.databaseName
    })

    const newPool: Pool = new Pool({
      user: dbConfig.username,
      host: dbConfig.host,
      database: pgConfig.databaseName,
      password: dbConfig.password,
      port: dbConfig.port,
      ...pgConfig.connectionPoolSettings
    })

    try {
      const client: PoolClient = await newPool.connect()
      client.release()
      logger('PostgresService').info('New pool connection test successful.')
      return newPool
    } catch (error) {
      await newPool.end()
      throw new PoolConnectionError(
        'Failed to connect with new pool configuration',
        error
      )
    }
  }

  /**
   * Rebuilds the connection pool with the latest configuration from ConfigService.
   * Closes the old pool after the new one is successfully created and validated.
   * Updates the activePoolConfigSignature to reflect the current configuration.
   */
  private async rebuildPool(): Promise<void> {
    const oldPool: Pool = this.pool
    this.pool = await this.createAndValidatePool()
    this.activePoolConfigSignature = JSON.stringify({
      db: this.configService.getConfig().DB_CONFIG,
      pg: this.configService.getConfig().PG_CONFIG
    })

    if (oldPool) {
      try {
        await oldPool.end()
      } catch (error) {
        logger('PostgresService').error(
          'Failed to close old pool, but continuing with new pool',
          undefined,
          error
        )
      }
    }
  }

  /**
   * Ensures only one refresh operation is executed at a time.
   * Retrieves new database credentials and rebuilds the connection pool.
   * If a refresh is already in progress, waits for it to complete instead of starting a new one.
   */
  private async refreshConnection(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }
    const refreshOperation: () => Promise<void> = async () => {
      try {
        logger('PostgresService').info(
          'Attempting to refresh DB credentials from AWS...'
        )
        const secretsService: SecretsService = SecretsService.getInstance({
          configService: this.configService
        })
        const newCredentials: DatabaseConfig =
          await secretsService.retrieveSecret(
            this.configService.getConfig().PG_CONFIG.databaseSecretName
          )

        // Update only the DB_CONFIG - ConfigService will merge with current config
        await this.configService.updateConfig({
          DB_CONFIG: newCredentials
        })

        await this.rebuildPool()
      } catch (error) {
        logger('PostgresService').error(
          'Failed to refresh credentials and rebuild pool:',
          undefined,
          error
        )
        throw error
      } finally {
        this.refreshPromise = null
      }
    }

    this.refreshPromise = refreshOperation()
    return this.refreshPromise
  }

  /**
   * Executes a SQL query with automatic retry logic on authentication or connection failures.
   * If a known failure occurs, the connection pool is refreshed and the query is retried once.
   * @param sql - The SQL query string. I.e, 'SELECT * FROM users WHERE id = $1'
   * @param params - Array of parameters for the query. I.e, [12345]
   * @returns Promise with the rows returned by the query. I.e, [{ id: 12345, name: 'John Doe' }]
   */
  public async query(sql: string, params?: any[]): Promise<any[]> {
    await this.ensureInitialized()
    try {
      return await this.executeRawQuery(sql, params)
    } catch (error) {
      if (connectionFailuresSet.has(error.code)) {
        logger('PostgresService').info(
          `Authentication error detected (Code: ${error.code}). Attempting credential refresh`
        )
        await this.refreshConnection()
        // Retry the query after refreshing credentials
        return await this.executeRawQuery(sql, params)
      }
      throw error
    }
  }

  /**
   * Performs a direct SQL query using the current connection pool.
   * This method assumes a valid pool and does not handle reconnection logic. It is intended to be used internally.
   * @param sql - The SQL query string. I.e, 'SELECT * FROM users WHERE id = $1'
   * @param params - Optional array of parameters for the query. I.e, [12345]
   * @returns Promise resolving to the rows returned by the query in camelCase format. I.e, [{ id: 12345, name: 'John Doe' }]
   */
  private async executeRawQuery(sql: string, params?: any[]): Promise<any[]> {
    // proactive logic: check if general config changed
    const currentConfigSignature: string = JSON.stringify({
      db: this.configService.getConfig().DB_CONFIG,
      pg: this.configService.getConfig().PG_CONFIG
    })
    if (currentConfigSignature !== this.activePoolConfigSignature) {
      logger('PostgresService').info(
        'Proactive configuration change detected. Rebuilding pool...'
      )
      await this.rebuildPool()
    }
    const client: PoolClient = await this.pool.connect()
    try {
      const result: QueryResult = await client.query(sql, params)
      const processedResponse: Array<Record<string, any>> = result.rows.map(
        (row) => this.convertToCamelCase(row)
      )
      return processedResponse
    } finally {
      client.release()
    }
  }

  /**
   * Executes a SQL query and returns a single result.
   * @param sql - The SQL query string. I.e, 'SELECT * FROM users WHERE id = $1'
   * @param params - Array of parameters for the query. I.e, [12345]
   * @returns Promise with the first row returned by the query or null if no rows are found. I.e, { id: 12345, name: 'John Doe' }
   */
  public async queryOne(sql: string, params?: any[]): Promise<any> {
    const results: any[] = await this.query(sql, params)
    return results[0]
  }

  /**
   * Executes a SQL query without returning results (useful for INSERT, UPDATE, DELETE).
   * @param sql - The SQL query string. I.e, 'DELETE FROM users WHERE id = $1'
   * @param params - Array of parameters for the query. I.e, [12345]
   */
  public async executeNonQuery(sql: string, params?: any[]): Promise<void> {
    await this.query(sql, params)
  }

  /**
   * Closes the Pool instance to release all active connections.
   */
  public async close(): Promise<void> {
    await this.ensureInitialized()
    await this.pool.end()
  }

  /**
   * Converts an object's keys from snake_case to camelCase.
   * @param row - Object with keys in snake_case. I.e, { user_id: 12345, user_name: 'John Doe' }
   * @returns Object with keys in camelCase. I.e, { userId: 12345, userName: 'John Doe' }
   */
  private convertToCamelCase(row: Record<string, any>): Record<string, any> {
    const converted: Record<string, any> = {}
    for (const key of Object.keys(row)) {
      converted[camelCase(key)] = row[key]
    }
    return converted
  }
}
