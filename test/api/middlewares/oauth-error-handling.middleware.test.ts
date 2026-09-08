import { describe, test, expect, vi } from 'vitest'
import { oauthErrorHandlerMiddleware } from '../../../src/api/middlewares/oauth-error-handling.middleware'
import { AccessNotPermittedError } from '../../../src/errors/auth.errors'
import { Response, NextFunction } from 'express'
import { mockGenericError, mockReq, mockUnauthorizedError } from './mocks/oauth-error-handling.middleware.mock'

describe('Test for the oauthErrorHandlerMiddleware', () => {
  const res: Response<any, Record<string, any>> = {} as Response
  const next: NextFunction = vi.fn() as unknown as NextFunction

  test('should call next with AccessNotPermittedError for UnauthorizedError', () => {

    oauthErrorHandlerMiddleware(mockUnauthorizedError, mockReq, res, next)

    expect(next).toHaveBeenCalledWith(expect.any(AccessNotPermittedError))
    const nextError = (next as any).mock.calls[0][0]
    expect(nextError.message).toBe(
      'An error occurred during authentication, please check the details.'
    )
    expect(nextError.details.request).toBe('/test')
  })

  test('should call next with the original error if test is not an UnauthorizedError', () => {
    oauthErrorHandlerMiddleware(mockGenericError, mockReq, res, next)

    expect(next).toHaveBeenCalledWith(mockGenericError)
  })

  test('should call next with no arguments if there is no error', () => {
    oauthErrorHandlerMiddleware(null as unknown as Error, mockReq, res, next)
    expect(next).toHaveBeenCalledWith()
  })
})
