import {
  BaseError,
  DetailsErrors,
  ErrorCategory
} from '@mercadoni/instaleap-utils'

export class PoolConnectionError extends BaseError {
  /**
   * This error is thrown when a new Postgres pool connection fails to establish.
   * It typically occurs during pool rebuilding or initialization, and indicates
   * that the service is unable to connect to the Postgres database.
   * @param errorMessage - A descriptive message explaining the context of the failure.
   * I.e, 'Failed to establish a new Postgres pool connection.'
   * @param errorDetails - Optional object containing the original error or any relevant debug data.
   * I.e, {
   *    originalErrorCode: 28P01,
   *    originalErrorMessage: 'password authentication failed for user "postgres"'
   * }
   */
  constructor(errorMessage: string, errorDetails?: DetailsErrors) {
    super(ErrorCategory.DEPENDENCY_FAILURE, errorMessage, 4, errorDetails)
  }
}
