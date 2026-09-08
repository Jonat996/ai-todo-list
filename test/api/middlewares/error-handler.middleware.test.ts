import type { Request, Response, NextFunction } from 'express'
import { BaseError, ErrorCategory } from '@mercadoni/instaleap-utils'
import { beforeEach, describe, expect, test, vi, type Mock } from 'vitest'
import {
  errorLoggerMock,
  infoLoggerMock,
  mockLogger,
  mockUuidv4
} from '../../mocks/general.mock'
import { httpErrorMapping } from '../../../src/mappings/error.maps'
import { errorHandlerMiddleware } from '../../../src/api/middlewares/error-handler.middleware'

class TestableError extends BaseError {
  constructor(
    category: ErrorCategory | string,
    message: string,
    code: number,
    details?: any,
    userDetails?: any
  ) {
    super(category as ErrorCategory, message, code, details, userDetails)
  }
}

vi.mock('uuid', () => ({
  v4: mockUuidv4
}))
vi.mock('@mercadoni/elementals/logger', () => mockLogger())

describe('Test suite for errorHandlerMiddleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction
  let mockStatus: Mock
  let mockJson: Mock
  const mockErrorId: string = 'mock-error-uuid-12345'

  beforeEach(() => {
    vi.clearAllMocks()
    mockUuidv4.mockReturnValue(mockErrorId)

    mockJson = vi.fn()
    mockStatus = vi.fn(() => ({ json: mockJson }))
    mockRes = {
      status: mockStatus
    }
    mockReq = {
      originalUrl: '/test/path',
      method: 'POST',
      get: vi.fn().mockReturnValue('Test-User-Agent/1.0')
    }
    mockNext = vi.fn() as NextFunction
  })

  describe('Handling BaseError instances', () => {
    test('should handle error with circular reference in details', () => {
      const circularObj: Record<string, any> = { message: 'Circular error' }
      circularObj.self = circularObj
      type ErrorWithCircular = Error & { circular: typeof circularObj }
      const genericError: ErrorWithCircular = new Error('Circular error') as ErrorWithCircular
      genericError.circular = circularObj

      errorHandlerMiddleware(
        genericError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          category: ErrorCategory.INTERNAL_ERROR,
          message: expect.stringContaining('Circular error'),
          details: null,
          errorId: mockErrorId
        })
      )
    })

    test('should log with warn level for VALIDATION category', () => {
      const validationError: TestableError = new TestableError(
        ErrorCategory.VALIDATION,
        'Validation failed',
        40001,
        { field: 'name' }
      )
      errorHandlerMiddleware(
        validationError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )
      expect(infoLoggerMock).toHaveBeenCalledWith(
        `[${mockErrorId}] WARN: Validation failed`,
        expect.objectContaining({
          category: ErrorCategory.VALIDATION,
          message: 'Validation failed',
          statusCode: httpErrorMapping[ErrorCategory.VALIDATION].statusCode
        })
      )
    })
    test('should handle a known BaseError correctly', () => {
      const notFoundError: TestableError = new TestableError(
        ErrorCategory.NOT_FOUND,
        'Resource not found',
        40401,
        { internal: 'details' },
        { client: 'message' }
      )
      const expectedMapping = httpErrorMapping[ErrorCategory.NOT_FOUND]

      errorHandlerMiddleware(
        notFoundError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(expectedMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith({
        category: notFoundError.category,
        message: notFoundError.message,
        code: notFoundError.code,
        details: notFoundError.userDetails,
        errorId: mockErrorId
      })
      expect(infoLoggerMock).toHaveBeenCalledTimes(1)
      expect(infoLoggerMock).toHaveBeenCalledWith(
        expect.stringContaining(mockErrorId),
        expect.objectContaining({
          category: notFoundError.category,
          message: notFoundError.message,
          statusCode: expectedMapping.statusCode,
          userAgent: 'Test-User-Agent/1.0'
        })
      )
      expect(errorLoggerMock).not.toHaveBeenCalled()
    })

    test('should handle a BaseError with "warn" log level correctly', () => {
      const validationError: TestableError = new TestableError(
        ErrorCategory.VALIDATION,
        'Invalid input',
        40001,
        { internal: 'details' }
      )
      const expectedMapping = httpErrorMapping[ErrorCategory.VALIDATION]

      errorHandlerMiddleware(
        validationError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(expectedMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith({
        category: validationError.category,
        message: validationError.message,
        code: validationError.code,
        details: null,
        errorId: mockErrorId
      })
      expect(infoLoggerMock).toHaveBeenCalledTimes(1)
      expect(infoLoggerMock).toHaveBeenCalledWith(
        `[${mockErrorId}] WARN: ${validationError.message}`,
        expect.objectContaining({
          category: validationError.category,
          message: validationError.message,
          statusCode: expectedMapping.statusCode,
          userAgent: 'Test-User-Agent/1.0'
        })
      )
      expect(errorLoggerMock).not.toHaveBeenCalled()
    })

    test('should use default mapping for a BaseError with an unknown category', () => {
      const unknownCategoryError: TestableError = new TestableError(
        'UNKNOWN_CUSTOM_CATEGORY',
        'An unusual error occurred',
        99999
      )
      const defaultMapping = httpErrorMapping[ErrorCategory.INTERNAL_ERROR]

      errorHandlerMiddleware(
        unknownCategoryError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(defaultMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith({
        category: unknownCategoryError.category,
        message: unknownCategoryError.message,
        code: unknownCategoryError.code,
        details: null,
        errorId: mockErrorId
      })
      expect(errorLoggerMock).toHaveBeenCalledTimes(1)
    })

    test('should correctly serialize a response when userDetails in a BaseError has a circular reference', () => {
      const circularUserDetails: Record<string, any> = {
        info: 'Details for the user',
        context: { data: 'some data' }
      }
      circularUserDetails.context.parent = circularUserDetails

      const errorWithCircularDetails: TestableError = new TestableError(
        ErrorCategory.INTERNAL_ERROR,
        'Error with circular user details',
        50001,
        { internal: 'some internal data' },
        circularUserDetails
      )

      errorHandlerMiddleware(
        errorWithCircularDetails,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockJson).toHaveBeenCalledWith({
        category: ErrorCategory.INTERNAL_ERROR,
        message: 'Error with circular user details',
        code: 50001,
        errorId: mockErrorId,
        details: {
          info: 'Details for the user',
          context: {
            data: 'some data',
            parent: '[Circular Reference]'
          }
        }
      })
      expect(errorLoggerMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('Handling generic and unknown errors', () => {
    test('should handle a standard generic Error instance', () => {
      const genericError: Error = new Error('Something unexpected happened')
      const defaultMapping = httpErrorMapping[ErrorCategory.INTERNAL_ERROR]

      errorHandlerMiddleware(
        genericError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(defaultMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith({
        category: ErrorCategory.INTERNAL_ERROR,
        message: `Uncaught exception: ${genericError.message}`,
        code: 1000,
        details: null,
        errorId: mockErrorId
      })
      expect(errorLoggerMock).toHaveBeenCalledTimes(1)
      expect(errorLoggerMock).toHaveBeenCalledWith(
        expect.stringContaining(mockErrorId),
        expect.objectContaining({
          details: expect.objectContaining({ stack: genericError.stack })
        }),
        genericError
      )
    })

    test('should handle a thrown object that is not an Error instance', () => {
      const thrownObject = { message: null }
      const defaultMapping = httpErrorMapping[ErrorCategory.INTERNAL_ERROR]

      errorHandlerMiddleware(
        thrownObject,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(defaultMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          category: ErrorCategory.INTERNAL_ERROR,
          message: 'Uncaught exception: Unknown error'
        })
      )
      expect(errorLoggerMock).toHaveBeenCalledTimes(1)
      expect(errorLoggerMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          details: thrownObject
        }),
        thrownObject
      )
    })

    test('should handle an error when User-Agent is not present', () => {
      const genericError: Error = new Error('Another error')
      mockReq.get = vi.fn().mockReturnValue(undefined) // No User-Agent

      errorHandlerMiddleware(
        genericError,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(errorLoggerMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          userAgent: 'none'
        }),
        genericError
      )
    })

    test('should handle a thrown primitive value', () => {
      const thrownString = 'This is a simple string error'
      const defaultMapping = httpErrorMapping[ErrorCategory.INTERNAL_ERROR]

      errorHandlerMiddleware(
        thrownString,
        mockReq as Request,
        mockRes as Response,
        mockNext
      )

      expect(mockStatus).toHaveBeenCalledWith(defaultMapping.statusCode)
      expect(mockJson).toHaveBeenCalledWith({
        category: ErrorCategory.INTERNAL_ERROR,
        message: 'Uncaught exception: Unknown error',
        code: 1000,
        details: null,
        errorId: mockErrorId
      })

      expect(errorLoggerMock).toHaveBeenCalledTimes(1)
      expect(errorLoggerMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          details: { stack: undefined }
        }),
        thrownString
      )
    })
  })
})
