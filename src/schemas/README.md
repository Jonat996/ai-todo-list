# Schemas

This directory contains validation schemas for configuration and data. These schemas are used with a validation library like [AJV](https://ajv.js.org/) to ensure that data structures conform to a predefined format.

## Configuration Schemas (`config.schemas.ts`)

This file defines JSON schemas for validating the application's configuration.

- **`portSchema`**: A simple schema to validate that the port is a number.
- **`authConfigSchema`**: A schema for the authentication configuration (`AuthConfig`), ensuring that all required properties for OAuth and API documentation users are present.
- **`databaseConfigSchema`**: A schema for the database configuration (`DatabaseConfig`), validating properties like the engine, host, port, and credentials.
- **`corsConfigSchema`**: A schema for the CORS configuration (`CorsConfig`), which expects an array of strings for the domain whitelist.
- **`globalConfigurationSchema`**: The main schema that combines all the other configuration schemas to validate the entire global configuration object (`GlobalConfiguration`).

## Example Schemas (`example.schemas.ts`)

This file defines JSON schemas for the example feature.

- **`exampleRequestSchema`**: A schema to validate the request body for the example endpoint. It ensures that the request body is an object with a `name` property of type `string`.

### How They Are Used

These schemas are typically used in utility functions (like `validation.utils.ts`) to validate objects.

**Example:**

```typescript
// In validation.utils.ts
import Ajv from 'ajv'
import { exampleRequestSchema } from '../schemas/example.schemas'
import { ExampleInterface } from '../interfaces/example.interfaces'

const ajv = new Ajv()

export function validateExampleRequest(data: any): ExampleInterface {
  const validate = ajv.compile<ExampleInterface>(exampleRequestSchema)
  if (validate(data)) {
    return data
  } else {
    // Throw a validation error
    throw new Error('Invalid request data')
  }
}
```
