# Services

This directory contains services that encapsulate business logic and interact with data sources. Services are responsible for performing specific tasks and are often used by controllers to handle complex operations.

## Example Service (`example.service.ts`)

The `ExampleServices` class is an example of a service that provides user-related data.

**Functionality:**

- **In-Memory Data**: It uses a private, in-memory array of users as its data source. In a real application, this would be replaced with a database connection.
- **`getUserInfoByName(name: string)`**: This method searches for a user by their first name (case-insensitively).
  - **Success**: If a user is found, it returns the user object.
  - **Failure**: If no user is found, it throws an error.

## Postgres Service (`postgres.service.ts`)

The `PostgresService` manages the connection to the PostgreSQL database using `node-postgres` (the `pg` library).

**Functionality:**

- **Connection Pool**: It creates and manages a connection pool for efficient database access.
- **`getInstance`**: A static method to implement the Singleton pattern, ensuring only one instance of the service is created.
- **`query`**: Executes a SQL query against the database.
- **`getClient`**: Retrieves a client from the connection pool for running transactions.

## Secrets Service (`secrets.service.ts`)

The `SecretsService` is responsible for fetching secrets from AWS Secrets Manager.

**Functionality:**

- **AWS SDK**: Uses `@aws-sdk/client-secrets-manager` to interact with AWS.
- **`getInstance`**: Implements the Singleton pattern.
- **`getSecret`**: Retrieves a secret value from Secrets Manager by its ID. It includes caching to avoid repeated API calls for the same secret.

### Usage

Services can be instantiated and used in controllers or other services to perform their respective tasks.

```typescript
// In a controller
import { ExampleServices } from '../services/example.service'

const exampleService = new ExampleServices()
try {
  const user = exampleService.getUserInfoByName('John')
  // Do something with the user data
} catch (error) {
  // Handle the error
}
```
