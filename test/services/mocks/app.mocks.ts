import { Mock, vi } from 'vitest'
import { mockGlobalConfig } from '../../mocks/env.mock'
import { GlobalConfiguration } from '../../../src/interfaces/configurations.interfaces'

/**
 * Mock ConfigService that simulates the real ConfigService behavior
 */
export const mockConfigService: {
  getConfig: Mock
  updateConfig: Mock
  getInstance: Mock
} = {
  getConfig: vi.fn().mockReturnValue(mockGlobalConfig),
  updateConfig: vi.fn().mockResolvedValue(undefined),
  getInstance: vi.fn().mockReturnThis()
}

/**
 * Mock of required initializer instances for Nexus project,
 * as essential and execution stores and services.
 */
export const mockInitializerInstances: {
  globalConfig: {
    getConfig: () => GlobalConfiguration
    updateConfig: (config: GlobalConfiguration) => Promise<void>
  }
  services: {
    postgresService: Mock
  }
} = {
  globalConfig: mockConfigService,
  services: {
    postgresService: vi.fn(),
  }
}