import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest'
import { exampleMiddleware } from '../../../src/api/middlewares/example.middleware'
import { ResponseHttpHandler } from '../../../src/utils/http.responses.utils'
import { ExampleController } from '../../../src/controllers/example.controller'
import type { Request, Response, NextFunction } from 'express'

vi.mock('../../../src/utils/http.responses.utils')
vi.mock('../../../src/controllers/example.controller')

vi.mock('../../../src/app', async () => {
  const { mockConfigService } = await import('../../services/mocks/app.mocks')
  return {
    services: {
      configService: mockConfigService,
    },
  }
})

describe('Test for the exampleMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let mockHandleSuccess: Mock

  beforeEach(() => {
    vi.clearAllMocks()

    mockHandleSuccess = vi.fn()
    vi.mocked(ResponseHttpHandler).mockImplementation(() => {
      return {
        handleSuccess: mockHandleSuccess,
      } as any
    })

    res = {}
    next = vi.fn()
  })

  test('should process the request successfully when body is valid', async () => {
    req = {
      body: { name: 'test' },
    }
    const mockUserInfo: {
      firstName: string;
      lastName: string;
    } = { firstName: 'Test', lastName: 'User' }

    const mockRetrieveUserData = vi.fn().mockReturnValue(mockUserInfo)
    vi.mocked(ExampleController).mockImplementation(() => {
      return {
        retrieveUserData: mockRetrieveUserData,
      } as any
    })

    await exampleMiddleware(req as Request, res as Response, next)

    expect(ExampleController).toHaveBeenCalledOnce()
    expect(mockRetrieveUserData).toHaveBeenCalledWith('test')
    expect(ResponseHttpHandler).toHaveBeenCalledWith(res)
    expect(mockHandleSuccess).toHaveBeenCalledWith(
      'The query has been successfully resolved',
      mockUserInfo
    )
    expect(next).not.toHaveBeenCalled()
  })

  test('should call next with an error if schema validation fails due to invalid body', async () => {
    req = {
      body: { name: 123 },
    }

    await exampleMiddleware(req as Request, res as Response, next)


    expect(next).toHaveBeenCalledOnce()
    const error = (next as Mock).mock.calls[0][0]
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('We have detected an error in the validation, please verify that all the required fields are correct')
    expect(mockHandleSuccess).not.toHaveBeenCalled()
    expect(ExampleController).not.toHaveBeenCalled()
  })

  test('should call next with an error if controller throws an error', async () => {
    req = {
      body: { name: 'test' },
    }
    const controllerError: Error = new Error('Controller error')

    const mockRetrieveUserData: Mock = vi.fn().mockImplementation(() => {
      throw controllerError
    })
    vi.mocked(ExampleController).mockImplementation(() => {
      return {
        retrieveUserData: mockRetrieveUserData,
      } as any
    })

    await exampleMiddleware(req as Request, res as Response, next)

    expect(ExampleController).toHaveBeenCalledOnce()
    expect(mockRetrieveUserData).toHaveBeenCalledWith('test')
    expect(next).toHaveBeenCalledWith(controllerError)
    expect(mockHandleSuccess).not.toHaveBeenCalled()
  })
})
