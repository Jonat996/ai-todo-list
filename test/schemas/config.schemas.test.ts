import { describe, test, expect } from 'vitest'
import {
  portSchema,
  authConfigSchema,
  databaseConfigSchema,
  corsConfigSchema,
  globalConfigurationSchema,
} from '../../src/schemas/config.schemas'
import { validateJSONSchema } from '@mercadoni/instaleap-utils'
import {
  mockValidPort,
  mockInvalidPort,
  mockValidAuthConfig,
  mockInvalidAuthConfig,
  mockValidDbConfig,
  mockInvalidDbConfigPort,
  mockValidCorsConfig,
  mockInvalidCorsConfig,
  mockValidGlobalConfig,
  mockInvalidGlobalConfig,
} from './mocks/config.schemas.mock'

describe('Test for the Configuration Schemas', () => {
  describe('Test for the portSchema', () => {
    test('should validate a valid port number', () => {
      expect(() => validateJSONSchema(portSchema, mockValidPort)).not.toThrow()
    })

    test('should throw an error for an invalid port type', () => {
      expect(() => validateJSONSchema(portSchema, mockInvalidPort)).toThrow(
        'We have detected an error in the validation, please verify that all the required fields are correct'
      )
    })
  })

  describe('Test for the authConfigSchema', () => {
    test('should validate a correct AuthConfig object', () => {
      expect(() =>
        validateJSONSchema(authConfigSchema, mockValidAuthConfig)
      ).not.toThrow()
    })

    test('should throw an error if required properties are missing', () => {
      expect(() =>
        validateJSONSchema(authConfigSchema, mockInvalidAuthConfig)
      ).toThrow('We have detected an error in the validation, please verify that all the required fields are correct')
    })
  })

  describe('Test for the databaseConfigSchema', () => {
    test('should validate a correct DatabaseConfig object', () => {
      expect(() =>
        validateJSONSchema(databaseConfigSchema, mockValidDbConfig)
      ).not.toThrow()
    })

    test('should throw an error for an invalid port number', () => {
      expect(() =>
        validateJSONSchema(databaseConfigSchema, mockInvalidDbConfigPort)
      ).toThrow('We have detected an error in the validation, please verify that all the required fields are correct')
    })
  })

  describe('Test for the corsConfigSchema', () => {
    test('should validate a correct CorsConfig object', () => {
      expect(() =>
        validateJSONSchema(corsConfigSchema, mockValidCorsConfig)
      ).not.toThrow()
    })

    test('should throw an error if domainsWhiteList is not an array of strings', () => {
      expect(() =>
        validateJSONSchema(corsConfigSchema, mockInvalidCorsConfig)
      ).toThrow('We have detected an error in the validation, please verify that all the required fields are correct')
    })
  })

  describe('Test for the globalConfigurationSchema', () => {
    test('should validate a correct GlobalConfiguration object with only PORT', () => {
      expect(() =>
        validateJSONSchema(globalConfigurationSchema, mockValidGlobalConfig)
      ).not.toThrow()
    })

    test('should throw an error if PORT is missing', () => {
      expect(() =>
        validateJSONSchema(globalConfigurationSchema, mockInvalidGlobalConfig)
      ).toThrow('We have detected an error in the validation, please verify that all the required fields are correct')
    })
  })
})
