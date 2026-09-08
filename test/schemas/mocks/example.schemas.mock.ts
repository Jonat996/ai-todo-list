import { ExampleInterface } from '../../../src/interfaces/example.interfaces'

/**
 * Mocks for validExampleData
 */
export const mockValidExampleData: ExampleInterface = { name: 'John Doe' }

/**
 * Mocks for missingNameData
 */
export const mockMissingNameData: object = {}

/**
 * Mocks for wrongTypeData
 */
export const mockWrongTypeData: Record<string, any> = { name: 12345 }

/**
 * Mocks for additionalPropertiesData
 */
export const mockAdditionalPropertiesData: Record<string, any> = { name: 'John Doe', age: 30 }


