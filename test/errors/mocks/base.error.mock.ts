/**
 * Mock for the error details.
 */
export const mockErrorDetails: {
    name: string
    $fault: string
    $metadata: {
        httpStatusCode: number
        requestId: string
        attempts: number
        totalRetryDelay: number
    }
    __type: string
} = {
  name: 'ClusterNotFoundException',
  $fault: 'client',
  $metadata: {
    httpStatusCode: 400,
    requestId: '17d782f0-73b3-4cad-9103-f1731f3e3a2a',
    attempts: 1,
    totalRetryDelay: 0
  },
  __type: 'ClusterNotFoundException'
}

/**
 * Mock for the user details.
 */
export const mockUserDetails: string =
  'An error has occurred in the Coulson Service. Please try again later.'
