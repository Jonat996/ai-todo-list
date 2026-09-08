# Source Code

This directory contains the main source code of the application, organized into subdirectories based on functionality.

## Project Structure

- **`app.ts`**: The main entry point of the application. It initializes and loads all services and starts the API server.
- **`env.ts`**: Manages environment variables and global configurations.
- **`api/`**: Contains all API-related files, including routes and middleware.
- **`controllers/`**: Handles the business logic for incoming requests.
- **`docs/`**: Contains API documentation setup, like Swagger.
- **`errors/`**: Custom error classes for handling exceptions.
- **`interfaces/`**: TypeScript interfaces for defining data structures.
- **`loaders/`**: Modules for loading and initializing different parts of the application.
- **`mappings/`**: Maps data between different formats.
- **`persistence/`**: Contains data persistence logic, such as database configurations, migrations, and models.
- **`schemas/`**: Validation schemas for data and configurations.
- **`services/`**: Services that encapsulate business logic and interact with data sources.
- **`utils/`**: Reusable utility functions.

## Application Flow

1.  **Initialization (`app.ts`)**: The `loadAll` function is called to start the application.
2.  **Service Loading (`loaders/services.loader.ts`)**: It dynamically loads all services defined in the `services` directory.
3.  **API Server Start (`loaders/api-server.load.ts`)**: It initializes the Express server, sets up middleware, and registers all the routes from the `api/routes` directory.
4.  **Request Handling**: Incoming requests are routed to the appropriate controller, which then uses services and utils to process the request and send a response.
