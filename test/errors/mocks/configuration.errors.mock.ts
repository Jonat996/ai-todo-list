/**
 * Mock for the error details.
 */
export const mockErrorDetails: {
    secretName: string;
    originalError: string;
} = {
  secretName: 'xandar/db',
  originalError: 'Unexpected token } in JSON'
}

/**
 * Mock for the error message.
 */
export const mockErrorMessage: string = 'Configuration must have script property.'

/**
 * Mock for initialization error details.
 */
export const mockInitializationErrorDetails: {
    serviceName: string;
    originalError: string;
} = {
  serviceName: 'UserService',
  originalError: 'Database connection timeout'
}

/**
 * Mock for initialization error message.
 */
export const mockInitializationErrorMessage: string = 'Failed to initialize database connection.'
