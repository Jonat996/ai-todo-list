# Testing

This directory contains all the tests for the application, ensuring code quality, correctness, and reliability. The structure of this directory mirrors the `src` directory, making it easy to locate tests for specific components.

## Testing Framework

The project uses [Vitest](https://vitest.dev/) as its testing framework. Vitest is a fast and modern test runner that is compatible with Vite and provides a Jest-compatible API.

## Test Structure

Each subdirectory within `test` corresponds to a subdirectory in `src`. For example, tests for services found in `src/services` are located in `test/services`.

- **`api/`**: Contains tests for API-related functionalities like middleware.
- **`controllers/`**: Contains tests for the business logic within controllers.
- **`docs/`**: Contains tests for the documentation generation.
- **`errors/`**: Contains tests for custom error classes.
- **`loaders/`**: Contains tests for the application loaders.
- **`schemas/`**: Contains tests for validation schemas.
- **`services/`**: Contains tests for the business logic within services.
- **`utils/`**: Contains tests for reusable utility functions.
- **`env.test.ts`**: Contains tests for environment variable handling.

### Mocks

Many of the subdirectories contain a `mocks/` folder. These folders hold mock implementations, test data, and stubs used to isolate components during testing. For example, `test/services/mocks/` might contain a mock implementation of a database service to prevent tests from hitting an actual database.

## Running Tests

Tests can be executed using the following npm scripts:

- **`npm test`**: Runs all tests.
- **`npm run test:debug`**: Runs tests in debug mode.
- **`npm run coverage`**: Runs tests and generates a code coverage report.
