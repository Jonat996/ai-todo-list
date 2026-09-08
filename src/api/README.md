# API

This directory contains all API-related files, including routes and middleware, which are essential for handling incoming HTTP requests.

## Structure

- **`middlewares/`**: Contains custom middleware functions for tasks like authentication, error handling, and request logging.
- **`routes/`**: Defines the API endpoints and connects them to the appropriate controllers.

## Main Router (`index.routes.ts`)

The main router aggregates all the individual route modules and configures global middleware.

### Features:

- **CORS Configuration**: Configures Cross-Origin Resource Sharing (CORS) based on a whitelist of domains defined in the environment variables.
- **Health Check Endpoint**: Provides a `/health` endpoint to check the status of the application.
- **Example Route**: Includes an example route at `/retrieve`.
- **API Documentation**: Serves Swagger UI at the `/docs` endpoint for interactive API documentation.
- **OAuth 2.0 Middleware**: If OAuth 2.0 is enabled in the configuration, it applies `checkJwtMiddleware` for token validation and `oauthErrorHandlerMiddleware` for handling authentication errors.

### Example Usage:

A welcome message is returned at the root endpoint:

```http
GET /
```

```json
{
  "mensaje": "Welcome to Skrull!"
}
```
