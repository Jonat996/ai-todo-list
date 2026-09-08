import { Mock, vi } from 'vitest'

/**
 * Mock of a retrieveSecret function for SecretsService
 */
export const mockRetrieveSecret: Mock = vi.fn()

/**
 * Mock of a SecretsService instance.
 * Contains a mocked retrieveSecret function.
 */
export const mockSecretsServiceInstance: {
    retrieveSecret: Mock
} = {
  retrieveSecret: mockRetrieveSecret
}

/**
 * Mock of a SecretsService class.
 */
export class MockSecretsService {
  static readonly getInstance = vi.fn((config?: any) => mockSecretsServiceInstance)
}

/**
 * Mock of pg module for PostgreSQL client
 */
export const mockPgClient: {
    query: Mock
    release: Mock
} = {
  query: vi.fn(),
  release: vi.fn(),
}

/**
 * Mock of pg.Pool for PostgreSQL connection pool
 */
export const mockPgPool: {
    connect: Mock
    end: Mock
    _id: string
} = {
  connect: vi.fn().mockResolvedValue(mockPgClient),
  end: vi.fn().mockResolvedValue(undefined),
  _id: 'initial_pool',
}