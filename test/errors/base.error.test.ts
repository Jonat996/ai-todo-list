import { describe, test, expect } from 'vitest'
import { BaseServiceError } from '../../src/errors/base.error'
import { ErrorCategory } from '@mercadoni/instaleap-utils'
import { mockErrorDetails, mockUserDetails } from './mocks/base.error.mock'

describe('Test for the BaseServiceError', () => {
  test('should create an instance of BaseServiceError with correct properties', () => {
    const error: BaseServiceError = new BaseServiceError(mockErrorDetails, mockUserDetails)

    expect(error).toBeInstanceOf(BaseServiceError)
    expect(error.category).toBe(ErrorCategory.INTERNAL_ERROR)
    expect(error.message).toBe('An error has occurred in the Service')
    expect(error.code).toBe(1)
    expect(error.details).toEqual(mockErrorDetails)
    expect(error.userDetails).toEqual(mockUserDetails)
  })

  test('should create an instance of BaseServiceError without userDetails', () => {
    const error: BaseServiceError = new BaseServiceError(mockErrorDetails)

    expect(error).toBeInstanceOf(BaseServiceError)
    expect(error.category).toBe(ErrorCategory.INTERNAL_ERROR)
    expect(error.message).toBe('An error has occurred in the Service')
    expect(error.code).toBe(1)
    expect(error.details).toEqual(mockErrorDetails)
    expect(error.userDetails).toBeUndefined()
  })
})
