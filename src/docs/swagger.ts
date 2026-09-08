import swaggerJSDoc, {
  Schema,
  type OAS3Definition,
  type OAS3Options
} from 'swagger-jsdoc'
import { existsSync } from 'fs'
import { exampleRequestSchema } from '../schemas/example.schemas'

const swaggerDefinition: OAS3Definition = {
  openapi: '3.0.3',
  info: {
    title: 'Skrull',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'http://localhost:3000'
    }
  ],
  components: {
    schemas: {
      ExampleSchema: exampleRequestSchema as Schema
    }
  }
}

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: [
    existsSync('./src/api/routes')
      ? './src/api/routes/*.ts'
      : './src/api/routes/*.js'
  ]
}

export default swaggerJSDoc(swaggerOptions)
