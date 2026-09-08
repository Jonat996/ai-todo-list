import { describe, test, expect, vi, beforeEach, Mock, MockInstance } from 'vitest'
import { mockGlobalConfig } from '../../mocks/env.mock'
import { errorLoggerMock } from '../../mocks/general.mock'
import { OauthConfig } from '../../../src/interfaces/configurations.interfaces'
import { RequestHandler } from 'express'

const jwtMock: Mock = vi.fn()
const expressJwtSecretMock: Mock = vi.fn()
const getConfigMock: Mock = vi.fn(() => mockGlobalConfig)

vi.mock('../../../src/app', () => ({
  services: {
    configService: {
      getConfig: getConfigMock
    }
  }
}))

vi.mock('express-jwt', () => ({
  expressjwt: jwtMock
}))

vi.mock('jwks-rsa', () => ({
  default: {
    expressJwtSecret: expressJwtSecretMock
  },
  expressJwtSecret: expressJwtSecretMock
}))

vi.mock('@mercadoni/elementals/logger', () => ({
  default: vi.fn(() => ({
    error: errorLoggerMock
  }))
}))

describe('Test for the checkJwtMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    jwtMock.mockReturnValue(undefined)
    getConfigMock.mockReturnValue(mockGlobalConfig)
  })

  test('should be configured with correct options on initialization', async () => {
    jwtMock.mockReturnValueOnce(() => { })
    const { initializeMiddleware } = await import(
      '../../../src/api/middlewares/oauth.middleware'
    )
    initializeMiddleware()

    const secretCallback: {
      jwksUri: string
      cache: boolean
      rateLimit: boolean
      jwksRequestsPerMinute: number
    } = expressJwtSecretMock.mock.calls[0][0]
    const authConfig: OauthConfig = mockGlobalConfig.AUTH_CONFIG.oauthConfig
    expect(secretCallback.jwksUri).toBe(
      `https://${authConfig.domain}/.well-known/jwks.json`
    )
    expect(secretCallback.cache).toBe(true)
    expect(secretCallback.rateLimit).toBe(true)
    expect(secretCallback.jwksRequestsPerMinute).toBe(5)

    const jwtOptions: {
      audience: string
      issuer: string
      algorithms: string[]
    } = jwtMock.mock.calls[0][0]

    expect(jwtOptions.audience).toBe(authConfig.audience)
    expect(jwtOptions.issuer).toBe(`https://${authConfig.domain}/`)
    expect(jwtOptions.algorithms).toEqual(['RS256'])
  })

  test('getCheckJwtMiddleware should return the middleware after initialization', async () => {
    jwtMock.mockReturnValueOnce(() => { })
    const { initializeMiddleware, getCheckJwtMiddleware } = await import(
      '../../../src/api/middlewares/oauth.middleware'
    )
    initializeMiddleware()
    const middleware: RequestHandler = getCheckJwtMiddleware()
    expect(middleware).toBeDefined()
    expect(typeof middleware).toBe('function')
  })

  test('getCheckJwtMiddleware should throw an error if called before initialization', async () => {
    // No mock override needed, will use the default uninitialized state
    const { getCheckJwtMiddleware } = await import(
      '../../../src/api/middlewares/oauth.middleware'
    )

    expect(() => getCheckJwtMiddleware()).toThrow(
      'JWT middleware has not been initialized yet.'
    )
  })

  test('should log an error and exit if initialization fails', async () => {
    const testError: Error = new Error('Failed to get config')
    getConfigMock.mockImplementation(() => {
      throw testError
    })

    const processExitSpy: MockInstance = vi
      .spyOn(process, 'exit')
      .mockImplementation(((_code?: string | number | null | undefined) => { }) as (code?: string | number | null | undefined) => never)

    const { initializeMiddleware } = await import(
      '../../../src/api/middlewares/oauth.middleware'
    )
    initializeMiddleware()

    expect(errorLoggerMock).toHaveBeenCalledWith(
      'Failed to initialize JWT middleware:',
      undefined,
      testError
    )
    expect(processExitSpy).toHaveBeenCalledWith(1)
    processExitSpy.mockRestore()
  })
})
