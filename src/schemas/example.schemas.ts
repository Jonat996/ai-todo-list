import { JSONSchemaType } from 'ajv'
import { ExampleInterface } from '../interfaces/example.interfaces'

/**
 * JSON Schema to validate the fields of the example request
 */
export const exampleRequestSchema: JSONSchemaType<ExampleInterface> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
}
