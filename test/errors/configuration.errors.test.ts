import { describe, test, expect } from 'vitest'
import { InvalidConfigError, InitializationError } from '../../src/errors/configuration.errors'
import { ErrorCategory } from '@mercadoni/instaleap-utils'
import {
  mockErrorDetails,
  mockErrorMessage,
  mockInitializationErrorDetails,
  mockInitializationErrorMessage
} from './mocks/configuration.errors.mock'

describe('Test for the InvalidConfigError', () => {
  test('should create an instance of InvalidConfigError with correct properties', () => {
    const error: InvalidConfigError = new InvalidConfigError(
      mockErrorMessage,
      mockErrorDetails
    )

    expect(error).toBeInstanceOf(InvalidConfigError)
    expect(error.category).toBe(ErrorCategory.CONFIGURATION_ERROR)
    expect(error.message).toBe(mockErrorMessage)
    expect(error.code).toBe(3)
    expect(error.details).toEqual(mockErrorDetails)
  })
})

describe('Test for the InitializationError', () => {
  test('should create an instance of InitializationError with correct properties', () => {
    const error: InitializationError = new InitializationError(
      mockInitializationErrorMessage,
      mockInitializationErrorDetails
    )

    expect(error).toBeInstanceOf(InitializationError)
    expect(error.category).toBe(ErrorCategory.INTERNAL_ERROR)
    expect(error.message).toBe(mockInitializationErrorMessage)
    expect(error.code).toBe(6)
    expect(error.details).toEqual(mockInitializationErrorDetails)
  })

  test('should create an instance of InitializationError without details', () => {
    const error: InitializationError = new InitializationError(
      mockInitializationErrorMessage
    )

    expect(error).toBeInstanceOf(InitializationError)
    expect(error.category).toBe(ErrorCategory.INTERNAL_ERROR)
    expect(error.message).toBe(mockInitializationErrorMessage)
    expect(error.code).toBe(6)
    expect(error.details).toBeUndefined()
  })
})
