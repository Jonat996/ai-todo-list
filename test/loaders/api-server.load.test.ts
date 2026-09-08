import { mockGlobalConfig } from '../mocks/env.mock'
import { describe, test, expect, vi, beforeEach, type MockInstance, type Mock } from 'vitest'
import express from 'express'
import { ApiServerLoader } from '../../src/loaders/api-server.load'


vi.mock('../../src/app', () => ({
  services: {
    configService: {
      getConfig: vi.fn().mockReturnValue(mockGlobalConfig)
    }
  }
}))

vi.mock('../../src/api/routes/index.routes', () => ({
  default: vi.fn().mockResolvedValue({ routerId: 'mockedIndexRouter' }),
  createRouter: vi.fn(() => ({ routerId: 'mockedIndexRouter' }))
}))

vi.mock('../../src/api/middlewares/oauth.middleware', () => ({
  initializationPromise: Promise.resolve(),
}))

vi.mock('express', () => {
  const mockApp: {
    use: Mock
    listen: Mock
} = {
    use: vi.fn(),
    listen: vi.fn(),
  }
  const expressMock = vi.fn(() => mockApp)

  Object.assign(expressMock, {
    Router: vi.fn(() => ({ use: vi.fn() })),
    json: vi.fn(() => 'jsonMiddleware'),
  })

  return { default: expressMock, ...expressMock }
})

const mockedExpress: any = express
const mockedJson: object = express.json
const mockAppInstance = mockedExpress()

describe('Test for the ApiServerLoader class', () => {
  let MOCK_PORT: number
  let apiServerLoader: ApiServerLoader

  beforeEach(async () => {
    const { mockGlobalConfig } = await import('../mocks/env.mock')
    MOCK_PORT = mockGlobalConfig.PORT
    vi.clearAllMocks()
    apiServerLoader = new ApiServerLoader()
  })

  describe('Test for the initialization of the ApiServerLoader class', () => {
    test('should create an Express application instance', () => {
      expect(mockedExpress).toHaveBeenCalledOnce()
      expect(apiServerLoader.app).toBe(mockAppInstance)
    })
  })

  describe('Test for the load method', () => {
    test('should get the global config and set the port', async () => {
      const { services } = await import('../../src/app')
      await apiServerLoader.load()
      expect(services.configService.getConfig).toHaveBeenCalled()
      expect(apiServerLoader.port).toBe(MOCK_PORT)
    })

    test('should start the server on the correct port', async () => {
      await apiServerLoader.load()
      expect(mockAppInstance.listen).toHaveBeenCalledOnce()
      expect(mockAppInstance.listen).toHaveBeenCalledWith(MOCK_PORT, expect.any(Function))
    })

    test('should register the express.json middleware', async () => {
      await apiServerLoader.load()
      expect(mockedJson).toHaveBeenCalledOnce()
      expect(mockAppInstance.use).toHaveBeenCalledWith('jsonMiddleware')
    })

    test('should register the indexRouter on the root path "/"', async () => {
      await apiServerLoader.load()
      expect(mockAppInstance.use).toHaveBeenCalledWith('/', { routerId: 'mockedIndexRouter' })
    })

    test('should return the Express application instance', async () => {
      const appInstance: express.Express = await apiServerLoader.load()
      expect(appInstance).toBe(mockAppInstance)
    })
  })

  describe('Test for the startServer (private method effect)', () => {
    test('should log a message to the console when the server starts', async () => {
      const consoleLogSpy: MockInstance<any> = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await apiServerLoader.load()
      
      const listenCallback: () => void = vi.mocked(mockAppInstance.listen).mock.calls[0][1] as () => void
      listenCallback()

      expect(consoleLogSpy).toHaveBeenCalledWith(`API server running in port ${MOCK_PORT}`)
      
      consoleLogSpy.mockRestore()
    })
  })
})