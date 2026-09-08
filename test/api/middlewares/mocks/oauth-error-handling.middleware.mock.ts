import { Request } from 'express'

/**
 * Mock for the request object.
 */
export const mockReq: Request = {
  originalUrl: '/test'
} as Request

/**
 * Mock for the UnauthorizedError.
 */
export const mockUnauthorizedError: Error = new Error('Unauthorized')
mockUnauthorizedError.name = 'UnauthorizedError'

/**
 * Mock for a generic error.
 */
export const mockGenericError: Error = new Error('Some other error')
