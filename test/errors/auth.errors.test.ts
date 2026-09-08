import { describe, test, expect } from 'vitest'
import { AccessNotPermittedError } from '../../src/errors/auth.errors'
import { ErrorCategory } from '@mercadoni/instaleap-utils'
import {
  mockErrorDetails,
  mockRequest,
  mockToken
} from './mocks/auth.errors.mock'

describe('Test for the AccessNotPermittedError', () => {
  test('should create an instance of AccessNotPermittedError with correct properties', () => {
    const error: AccessNotPermittedError = new AccessNotPermittedError(mockErrorDetails, mockRequest, mockToken)

    expect(error).toBeInstanceOf(AccessNotPermittedError)
    expect(error.category).toBe(ErrorCategory.AUTHENTICATION)
    expect(error.message).toBe(
      'An error occurred during authentication, please check the details.'
    )
    expect(error.code).toBe(2)
    expect(error.details).toEqual({
      errorDetails: mockErrorDetails,
      request: mockRequest,
      token: mockToken
    })
    expect(error.userDetails).toEqual(mockErrorDetails)
  })

  test('should create an instance of AccessNotPermittedError without a token', () => {
    const error: AccessNotPermittedError = new AccessNotPermittedError(mockErrorDetails, mockRequest)

    expect(error).toBeInstanceOf(AccessNotPermittedError)
    expect(error.category).toBe(ErrorCategory.AUTHENTICATION)
    expect(error.message).toBe(
      'An error occurred during authentication, please check the details.'
    )
    expect(error.code).toBe(2)
    expect(error.details).toEqual({
      errorDetails: mockErrorDetails,
      request: mockRequest,
      token: undefined
    })
    expect(error.userDetails).toEqual(mockErrorDetails)
  })
})
