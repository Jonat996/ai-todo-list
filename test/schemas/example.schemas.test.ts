import { describe, test, expect } from 'vitest'
import { exampleRequestSchema } from '../../src/schemas/example.schemas'
import { validateJSONSchema } from '@mercadoni/instaleap-utils'
import {
  mockValidExampleData,
  mockMissingNameData,
  mockWrongTypeData,
  mockAdditionalPropertiesData,
} from './mocks/example.schemas.mock'
import { ExampleInterface } from '../../src/interfaces/example.interfaces'

describe('Test for the exampleRequestSchema', () => {
  test('should validate a correct object successfully', () => {
    const validationFn: () => ExampleInterface = () =>
      validateJSONSchema(exampleRequestSchema, mockValidExampleData)

    expect(validationFn).not.toThrow()

    expect(validationFn()).toEqual(mockValidExampleData)
  })

  test('should throw an error if the name property is missing', () => {
    const validationFn: () => object = () =>
      validateJSONSchema(exampleRequestSchema, mockMissingNameData)

    expect(validationFn).toThrow(
      'We have detected an error in the validation, please verify that all the required fields are correct'
    )
  })

  test('should throw an error if the name property is not a string', () => {
    const validationFn: () => Record<string, any> = () =>
      validateJSONSchema(exampleRequestSchema, mockWrongTypeData)

    expect(validationFn).toThrow(
      'We have detected an error in the validation, please verify that all the required fields are correct'
    )
  })

  test('should throw an error if there are additional properties', () => {
    const validationFn: () => Record<string, any> = () =>
      validateJSONSchema(exampleRequestSchema, mockAdditionalPropertiesData)

    expect(validationFn).toThrow(
      'We have detected an error in the validation, please verify that all the required fields are correct'
    )
  })
})

