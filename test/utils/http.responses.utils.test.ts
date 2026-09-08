import { describe, test, expect, vi, beforeEach } from 'vitest'
import { ResponseHttpHandler } from '../../src/utils/http.responses.utils'
import type { Response } from 'express'
import {
  mockProcessId,
  mockCustomMessage,
  mockCustomPayload,
  mockCustomStatusCode,
  mockExpectedResponseWithCustoms,
  mockDefaultStatusMessage,
  mockDefaultStatusPayload,
  mockExpectedResponseWithDefaultStatus,
  mockDefaultMessagePayload,
  mockExpectedResponseWithDefaultMessage,
  mockNoPayloadMessage,
  mockExpectedResponseWithNoPayload,
} from './mocks/http.responses.utils.mock'

describe('Test for the ResponseHttpHandler', () => {
  let mockResponse: Partial<Response>
  let mockSend: ReturnType<typeof vi.fn>
  let mockStatus: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockSend = vi.fn()
    mockStatus = vi.fn(() => ({
      send: mockSend,
    }))

    mockResponse = {
      locals: {
        processId: mockProcessId,
      },
      status: mockStatus,
    }
  })

  test('should correctly initialize with the response object', () => {
    const handler: ResponseHttpHandler = new ResponseHttpHandler(mockResponse as Response)
    expect(handler).toHaveProperty('res', mockResponse)
    expect(handler).toHaveProperty('processId', mockProcessId)
  })

  describe('Test for the handleSuccess method', () => {
    test('should send a success response with a custom message, payload, and status code', () => {
      const handler: ResponseHttpHandler = new ResponseHttpHandler(mockResponse as Response)
      handler.handleSuccess(mockCustomMessage, mockCustomPayload, mockCustomStatusCode)

      expect(mockStatus).toHaveBeenCalledWith(mockCustomStatusCode)
      expect(mockSend).toHaveBeenCalledWith(mockExpectedResponseWithCustoms)
    })

    test('should use the default status code (200) if none is provided', () => {
      const handler = new ResponseHttpHandler(mockResponse as Response)
      handler.handleSuccess(mockDefaultStatusMessage, mockDefaultStatusPayload)

      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockSend).toHaveBeenCalledWith(mockExpectedResponseWithDefaultStatus)
    })

    test('should use the default message if no message is provided', () => {
      const handler = new ResponseHttpHandler(mockResponse as Response)
      handler.handleSuccess(undefined, mockDefaultMessagePayload)

      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockSend).toHaveBeenCalledWith(mockExpectedResponseWithDefaultMessage)
    })

    test('should handle calls with no payload', () => {
      const handler = new ResponseHttpHandler(mockResponse as Response)
      handler.handleSuccess(mockNoPayloadMessage)

      expect(mockStatus).toHaveBeenCalledWith(200)
      expect(mockSend).toHaveBeenCalledWith(mockExpectedResponseWithNoPayload)
    })
  })
})

