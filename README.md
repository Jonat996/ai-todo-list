# Skrull

[Github URL](https://github.com/mercadoni/Skrull)

Skrull is a versatile API designed to be a foundational template for building robust new systems from scratch. It provides a comprehensive starting point for development teams, incorporating a modern tech stack and best practices for creating scalable applications.

The project is fully configured to run inside Dev Containers, offering a consistent, isolated, and "zero-install" development environment for both local and cloud-based (GitHub Codespaces) workflows.

## Core Features

- Development Environment as Code: Pre-configured Dev Containers for different operating systems (Linux, Windows, WSL) and GitHub Codespaces.

- Robust API Framework: Built on Node.js with Express and TypeScript for a strongly-typed and maintainable codebase.
- Database Integration: Includes pg for object-relational mapping, with a ready-to-use PostgreSQL service in Docker.
- Infrastructure as Code: A dedicated terraform/ directory for managing infrastructure resources.
- Automated Quality Checks: Linting and formatting with ESLint and Prettier, enforced by Husky Git hooks.
- Integrated Testing: Unit and integration test setup with Vitest, including coverage reports.
- API Documentation: Automatic Swagger/OpenAPI documentation generation from code comments.
- AI Assistant Integration: Comes with pre-installed extensions and CLIs for GitHub Copilot, Claude, and Gemini to boost productivity.

## Tech Stack

- Backend: Node.js, Express.js
- Language: TypeScript
- Containerization: Docker, Docker Compose
- Database: PostgreSQL with TypeORM
- Testing: Vitest
- Linting & Formatting: ESLint, Prettier
- Git Hooks: Husky, lint-staged
- Infrastructure as Code: Terraform
- API Documentation: Swagger (OpenAPI)

## Getting Started

This project is designed to run inside a Dev Container, which handles all dependencies and tool installations for you. To get started, you only need Docker Desktop and Visual Studio Code with the Dev Containers extension.
For a detailed, step-by-step guide tailored to your specific setup (GitHub Codespaces, Windows with WSL, or local Linux/Windows), please refer to the complete guide:

➡️ [Full Setup Guide](.devcontainer/README.md)

This guide covers everything from initial setup and secret management to running the project in different environments.

## Project Structure

The project is organized into the following main directories:

- .devcontainer/: Contains all configurations for the development containers (for
- Codespaces, Linux, and Windows).
- .github/: Houses GitHub Actions workflows, such as CI/CD pipelines.
- scripts/: Includes various automation and helper scripts for environment setup and management.
- src/: The main source code of the application.
  - api/: API routes and middleware definitions.
  - controllers/: Business logic for handling requests.
  - docs/: Swagger setup for API documentation.
  - errors/: Custom error classes for standardized error handling.
  - interfaces/: TypeScript interfaces defining data structures and contracts.
  - loaders/: Modules for initializing the server and services.
  - mappings/: Data mapping files.
  - schemas/: Validation schemas (using AJV) for request data and configurations.
  - services/: Services that encapsulate business logic and data source interactions.
  - utils/: Reusable utility functions.
- test/: Contains all tests for the application, following a structure that mirrors the src directory.

## Available Scripts

Once inside the Dev Container, you can use the following npm scripts from the terminal:

Run the application in development mode:

```typescript
npm run start:dev
```

This starts the server with a hot reload and automatically restarts when a file is saved. However, keep in mind that the server is already running in devContainers, so it would be like having two applications running at the same time.

Run the application in debug mode:

```typescript
npm run dev:debug
```

This starts the server and attaches a Node.js debugger, allowing you to set breakpoints in VS Code, keep in mind that the server is already running in devContainers, so it would be like having two applications running at the same time.

Run tests:

```typescript
npm run test
```

This runs the entire test suite using Vitest and generates a coverage report.

Lint and format code:

```typescript
npm run lint
```

This runs ESLint to check for code quality and style issues.

Build the project for production:

```typescript
npm run build-ts
```

This compiles the TypeScript code into JavaScript in the dist/ directory.

## Commit Messages

This project uses the Conventional Commits specification. This is enforced by a commit-msg Git hook. Please ensure your commit messages follow this convention.

Examples:

```
- feat: Add user authentication endpoint
- fix: Correctly handle null values in user profile
- docs: Update README with setup instructions
- style: Format code with Prettier
- refactor: Simplify user service logic
- test: Add unit tests for the payment module
- chore: Update dependencies
```

# Note for New Projects

Skrull is designed as a template. When starting a new project based on it, it is recommended to perform a global search-and-replace for the term "skrull" (and its capitalized version "Skrull") and substitute it with your new project's name. This will ensure consistency across filenames, configurations, and documentation.
