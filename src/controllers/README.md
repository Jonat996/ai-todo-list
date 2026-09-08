# Controllers

This directory contains the controllers that handle the application's business logic. Controllers are responsible for processing incoming requests, interacting with services, and returning a response to the client.

## Base Controller (`base.controller.ts`)

The `BaseController` is an abstract class that provides common functionality to other controllers.

**Features:**

- **Process ID:** Each controller instance is associated with a `processId` to track individual requests.
- **Service Access:** It provides a `services` property for easy access to all loaded services.
- **Configuration Access:** It provides a `getConfig` method to access global environment variables and configurations.

**Usage:**

Other controllers should extend `BaseController` to inherit this common functionality.

```typescript
export class MyController extends BaseController {
  constructor(processId: string) {
    super(processId)
    // Now you can access this.services and this.getConfig()
  }
}
```

## Example Controller (`example.controller.ts`)

The `ExampleController` is a concrete implementation that demonstrates how to use the `BaseController`.

**Functionality:**

- **Service Injection:** It initializes `ExampleServices` to interact with the business logic related to examples.
- **`retrieveUserData` Method:** This method takes a user's name as input, calls the `exampleService` to get the user's information, and returns the result.
- **Error Handling:** It includes a `try...catch` block to handle potential errors from the service layer and re-throws them to be caught by a higher-level error handler.

**Usage:**

This controller is typically called from a middleware or route handler.

```typescript
const exampleController = new ExampleController('some-process-id')
const userData = exampleController.retrieveUserData('John')
```
