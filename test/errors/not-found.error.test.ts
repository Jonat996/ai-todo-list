import { describe, test, expect } from 'vitest'
import { ResourceNotFoundError } from '../../src/errors/not-found.error'
import { ErrorCategory } from '@mercadoni/instaleap-utils'
import {
  mockDetails,
  mockMessage,
  mockUserDetails
} from './mocks/not-found.error.mock'

describe('Test for the ResourceNotFoundError', () => {
  test('should create an instance of ResourceNotFoundError with correct properties', () => {
    const error: ResourceNotFoundError = new ResourceNotFoundError(
      mockMessage,
      mockDetails,
      mockUserDetails
    )

    expect(error).toBeInstanceOf(ResourceNotFoundError)
    expect(error.category).toBe(ErrorCategory.NOT_FOUND)
    expect(error.message).toBe(mockMessage)
    expect(error.code).toBe(5)
    expect(error.details).toEqual(mockDetails)
    expect(error.userDetails).toEqual(mockUserDetails)
  })

  test('should create an instance of ResourceNotFoundError without user details', () => {
    const error: ResourceNotFoundError = new ResourceNotFoundError(
      mockMessage,
      mockDetails
    )

    expect(error).toBeInstanceOf(ResourceNotFoundError)
    expect(error.category).toBe(ErrorCategory.NOT_FOUND)
    expect(error.message).toBe(mockMessage)
    expect(error.code).toBe(5)
    expect(error.details).toEqual(mockDetails)
    expect(error.userDetails).toBeUndefined()
  })
})
