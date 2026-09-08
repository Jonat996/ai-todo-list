import { StandardResponse } from '@mercadoni/instaleap-utils'

/**
 * Mocks for 'should initialize with the response object'
 */
export const mockProcessId: string = 'test-process-123'

/**
 * Mocks for 'should send a success response with a custom message, payload, and status code'
 */
export const mockCustomMessage: string = 'Operation successful'

/**
 * Mocks for 'should send a success response with a custom message, payload, and status code'
 */
export const mockCustomPayload: { data: string } = { data: 'some-data' }

/**
 * Mocks for 'should send a success response with a custom message, payload, and status code'
 */
export const mockCustomStatusCode: number = 201

/**
 * Mocks for 'should send a success response with a custom message, payload, and status code'
 */
export const mockExpectedResponseWithCustoms: StandardResponse = {
  processId: mockProcessId,
  message: mockCustomMessage,
  operationPayload: mockCustomPayload,
}

/**
 * Mocks for 'should use the default status code (200) if none is provided'
 */
export const mockDefaultStatusMessage: string = 'OK'

/**
 * Mocks for 'should use the default status code (200) if none is provided'
 */
export const mockDefaultStatusPayload: { status: string } = { status: 'ok' }

/**
 * Mocks for 'should use the default status code (200) if none is provided'
 */
export const mockExpectedResponseWithDefaultStatus: StandardResponse = {
  processId: mockProcessId,
  message: mockDefaultStatusMessage,
  operationPayload: mockDefaultStatusPayload,
}

/**
 * Mocks for 'should use the default message if no message is provided'
 */
export const mockDefaultMessagePayload: { result: string } = { result: 'done' }

/**
 * Mocks for 'should use the default message if no message is provided'
 */
export const mockDefaultMessage: string = `Process scheduled with ID ${mockProcessId} wait for more details in slack channel`

/**
 * Mocks for 'should use the default message if no message is provided'
 */
export const mockExpectedResponseWithDefaultMessage: StandardResponse = {
  processId: mockProcessId,
  message: mockDefaultMessage,
  operationPayload: mockDefaultMessagePayload,
}

/**
 * Mocks for 'should handle calls with no payload'
 */
export const mockNoPayloadMessage: string = 'Just a message'
export const mockExpectedResponseWithNoPayload: StandardResponse = {
  processId: mockProcessId,
  message: mockNoPayloadMessage,
  operationPayload: undefined,
}
