import { mockGlobalConfig } from '../mocks/env.mock'
import { describe, test, expect, vi, beforeEach, Mock } from 'vitest'
import { ExampleController } from '../../src/controllers/example.controller'
import { mockUserData, mockName, mockErrorMessage } from './mocks/example.controller.mock'
import { services } from '../../src/app'

vi.mock('../../src/services/example.service')
vi.mock('../../src/app', () => ({
  services: {
    configService: {
      getConfig: vi.fn().mockReturnValue(mockGlobalConfig)
    },
    exampleService: {},
    postgresService: {},
    secretsService: {}
  }
}))

describe('Test for the ExampleController', () => {
  const processId: string = 'test-process-id'
  let controller: ExampleController

  beforeEach(() => {
    vi.clearAllMocks()
    controller = new ExampleController(processId)
  })

  describe('Test for the retrieveUserData method', () => {
    test('should retrieve user data successfully', () => {
      // Mock the service method
      const getUserInfoByNameMock: Mock = vi.fn().mockReturnValue(mockUserData)
      services.exampleService.getUserInfoByName = getUserInfoByNameMock

      const result: {
        firstName: string
        lastName: string
        phone: string
      } = controller.retrieveUserData(mockName)

      expect(result).toEqual(mockUserData)
      expect(getUserInfoByNameMock).toHaveBeenCalledWith(mockName)
    })

    test('should throw an error if the service throws an error', () => {
      // Mock the service method to throw an error
      const getUserInfoByNameMock: Mock = vi.fn(() => {
        throw new Error(mockErrorMessage)
      })
      services.exampleService.getUserInfoByName = getUserInfoByNameMock

      expect(() => controller.retrieveUserData(mockName)).toThrow(Error)
      expect(getUserInfoByNameMock).toHaveBeenCalledWith(mockName)
    })
  })
})
