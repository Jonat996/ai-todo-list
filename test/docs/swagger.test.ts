import { describe, test, expect, vi, beforeEach } from 'vitest'
import SwaggerParser from 'swagger-parser'

describe('Test for the swagger documentation configuration', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  test('should be a valid OpenAPI 3.0 specification', async () => {
    const { default: swaggerSpec }: { default: object } = await import('../../src/docs/swagger')
    await expect(
      SwaggerParser.validate(swaggerSpec as any)
    ).resolves.not.toThrow()
  })

  test('should have the correct title and version', async () => {
    const { default: swaggerSpec }: { default: Record<string, any> } = (await import(
      '../../src/docs/swagger'
    )) as any
    expect(swaggerSpec.info.title).toBe('Skrull')
    expect(swaggerSpec.info.version).toBe('1.0.0')
  })

  test('should have at least one server defined', async () => {
    const { default: swaggerSpec }: { default: Record<string, any> } = (await import(
      '../../src/docs/swagger'
    )) as any
    expect(swaggerSpec.servers).toBeDefined()
    expect(swaggerSpec.servers.length).toBeGreaterThan(0)
    expect(swaggerSpec.servers[0].url).toBe('http://localhost:3000')
  })

  test('should have components and schemas defined', async () => {
    const { default: swaggerSpec }: { default: Record<string, any> } = (await import(
      '../../src/docs/swagger'
    )) as any
    expect(swaggerSpec.components).toBeDefined()
    expect(swaggerSpec.components.schemas).toBeDefined()
  })

  test('should include the ExampleSchema', async () => {
    const { default: swaggerSpec }: { default: Record<string, any> } = (await import(
      '../../src/docs/swagger'
    )) as any
    expect(swaggerSpec.components.schemas.ExampleSchema).toBeDefined()
  })

  test('should use .js files as a fallback when the routes directory does not exist', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn(() => false),
    }))

    const { default: swaggerSpecWithJsFallback }: { default: object } = await import(
      '../../src/docs/swagger'
    )

    await expect(
      SwaggerParser.validate(swaggerSpecWithJsFallback as any)
    ).resolves.not.toThrow()
  })
})
