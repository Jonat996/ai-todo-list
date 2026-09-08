import { describe, test, expect } from 'vitest'
import { PoolConnectionError } from '../../src/errors/dependency.errors'
import { ErrorCategory } from '@mercadoni/instaleap-utils'
import {
  mockErrorDetails,
  mockErrorMessage
} from './mocks/dependency.errors.mock'

describe('Test for the PoolConnectionError', () => {
  test('should create an instance of PoolConnectionError with correct properties', () => {
    const error: PoolConnectionError = new PoolConnectionError(
      mockErrorMessage,
      mockErrorDetails
    )

    expect(error).toBeInstanceOf(PoolConnectionError)
    expect(error.category).toBe(ErrorCategory.DEPENDENCY_FAILURE)
    expect(error.message).toBe(mockErrorMessage)
    expect(error.code).toBe(4)
    expect(error.details).toEqual(mockErrorDetails)
  })

  test('should create an instance of PoolConnectionError without error details', () => {
    const error: PoolConnectionError = new PoolConnectionError(mockErrorMessage)

    expect(error).toBeInstanceOf(PoolConnectionError)
    expect(error.category).toBe(ErrorCategory.DEPENDENCY_FAILURE)
    expect(error.message).toBe(mockErrorMessage)
    expect(error.code).toBe(4)
    expect(error.details).toBeUndefined()
  })
})
