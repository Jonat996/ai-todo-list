import { mockGlobalConfig } from '../mocks/env.mock'
import { describe, test, expect, vi } from 'vitest'
import { BaseController } from '../../src/controllers/base.controller'
import { services } from '../../src/app'


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

describe('Test for the BaseController', () => {
  const processId: string = 'test-process-id'

  class TestController extends BaseController {
    constructor (processId: string) {
      super(processId)
    }

    public getServices () {
      return this.services
    }

    public getGetConfig () {
      return this.getConfig
    }

    public getProcessId () {
      return this.processId
    }
  }

  test('should set the processId correctly', () => {
    const controller: TestController = new TestController(processId)
    expect(controller.getProcessId()).toBe(processId)
  })

  test('should have access to services', () => {
    const controller: TestController = new TestController(processId)
    expect(controller.getServices()).toBe(services)
  })

  test('should have access to getConfig', () => {
    const controller: TestController = new TestController(processId)
    expect(controller.getGetConfig()).toEqual(mockGlobalConfig)
  })
})
