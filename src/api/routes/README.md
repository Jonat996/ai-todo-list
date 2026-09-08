# Routes

This directory contains the route definitions for the application. Each file in this directory typically corresponds to a feature or a resource, and it defines the API endpoints associated with it.

## Main Router (`index.routes.ts`)

The `index.routes.ts` file is the main router for the application. It aggregates all other route modules and applies global middleware.

**Features:**

- **CORS Configuration:** It configures Cross-Origin Resource Sharing (CORS) based on a whitelist of domains from the environment configuration.
- **Route Aggregation:** It includes routers for different features like health checks and examples.
- **API Documentation:** It sets up `swagger-ui-express` to serve API documentation at the `/docs` endpoint.
- **Authentication:** It conditionally applies OAuth 2.0 middleware (`checkJwtMiddleware` and `oauthErrorHandlerMiddleware`) if `OAUTH2.0` is set as the authentication type in the configuration.

## Available Routes

### `health.routes.ts`

This route provides a simple health check endpoint.

- **Endpoint:** `GET /health`
- **Description:** Returns a JSON object indicating that the service is healthy. This is useful for load balancers and monitoring systems.
- **Response:**
  ```json
  {
    "status": "healthy"
  }
  ```

### `example.route.ts`

This route provides an example of a more complex endpoint with request validation and Swagger documentation.

- **Endpoint:** `POST /retrieve/example`
- **Description:** This endpoint is an example of how to query users. It uses the `exampleMiddleware` to handle the request.
- **Swagger Documentation:** The route includes detailed Swagger annotations (`@swagger`) that describe the endpoint, its parameters, request body, and possible responses. This information is used to generate the interactive API documentation.
- **Request Body:** The expected request body should conform to the `ExampleSchema`.
- **Responses:**
  - `200 OK`: The query was successful.
  - `403 Forbidden`: An authentication error occurred.
  - `500 Internal Server Error`: An unexpected error occurred on the server.
