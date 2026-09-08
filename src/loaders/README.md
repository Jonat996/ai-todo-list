# Loaders

This directory contains loaders for initializing different parts of the application, such as the API server and services. Loaders are responsible for setting up and configuring various components when the application starts.

## Base Loader (`loader.ts`)

The `loader.ts` file defines an abstract `Loader` class that serves as a contract for all other loaders.

**Features:**

- **`abstract load()`**: This abstract method must be implemented by any class that extends `Loader`. It ensures that all loaders have a common entry point for their initialization logic.

## API Server Loader (`api-server.load.ts`)

The `ApiServerLoader` is responsible for setting up and starting the Express server.

**Functionality:**

- **Implements `Loader`**: It extends the `Loader` class and implements the `load` method.
- **Initialization**: The constructor sets the port from the global configuration and creates a new Express application instance.
- **`load()` Method**:
  - It calls `startServer` to begin listening for requests.
  - It mounts the main router (`indexRouter`) at the root path (`/`).
  - It returns the Express `app` instance.
- **`startServer()` Method**:
  - It applies the `express.json()` middleware to parse JSON request bodies.
  - It starts the server on the configured port and logs a message to the console.

## Services Loader (`services.loader.ts`)

The `services.loader.ts` is responsible for loading and initializing all the services that the application needs.

**Functionality:**

- **`load()` Function**: This asynchronous function is responsible for initializing all services. In the current implementation, it returns an empty object, but it is designed to be extended to dynamically import and instantiate service classes.

**Example of a more complete implementation:**

```typescript
import { readdirSync } from 'fs'
import { join } from 'path'

export async function load(): Promise<any> {
  const services: { [key: string]: any } = {}
  const servicesDir = join(__dirname, '../services')

  const serviceFiles = readdirSync(servicesDir).filter(
    (file) => file.endsWith('.service.ts') || file.endsWith('.service.js')
  )

  for (const file of serviceFiles) {
    const serviceModule = await import(join(servicesDir, file))

    const ServiceClass = serviceModule.default
    if (ServiceClass) {
      const serviceName = file.split('.')[0]
      services[serviceName] = new ServiceClass()
    }
  }

  return services
}
```
