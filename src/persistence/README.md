# Persistence

This directory is responsible for all data persistence-related logic, including database connections, data models, and migrations. It acts as an abstraction layer between the application's business logic and the underlying data storage.

## Structure

The `persistence` directory is organized by database. Each subdirectory represents a different database used by the application.

### `skrull/`

This directory contains the persistence logic for the `skrull` database.

- **`managers/`**: This directory is intended to hold data managers or repositories. These classes would typically encapsulate the logic for querying and manipulating data for specific database tables or collections. Currently, this directory is empty.

- **`migrations/`**: This directory contains database migration files, which are used to manage incremental and reversible changes to the database schema. These migrations are typically managed by a tool like `dbmate`. Currently, this directory is empty but would be populated with SQL files as the schema evolves.

## Purpose

- **Decoupling**: By centralizing data access logic here, the rest of the application does not need to be concerned with the specifics of the database implementation.
- **Organization**: It provides a clear and organized structure for managing all database-related code.
- **Schema Management**: The `migrations` subdirectories are crucial for maintaining a version-controlled history of the database schema, which is essential for collaboration and deployment.

### Creating a new migration file with dbmate

For all new database schema changes, `dbmate` is the preferred tool. It allows writing migrations in raw, version-controlled SQL files, providing greater control and clarity over the database schema.

To streamline the creation of new migration files, a convenient npm script is provided.

#### Local Environment with Docker

This method leverages the `dbmate` service defined in `docker-compose.yml` to ensure all developers use the same version of the tool.

#### DevContainer Usage

When working inside a DevContainer, the necessary environment variables are already configured, allowing you to use `dbmate` directly.

**Prerequisites:**

- Be inside the DevContainer shell.

**Command Syntax:**

```sh
npm run dbmate:generate -- <databaseName> <MigrationNameInPascalCase>
```

**Arguments:**

- `<database_name>`: The name of the database for which you want to create a migration.
- `<MigrationNameInPascalCase>`: A descriptive name for your migration in PascalCase. `dbmate` will automatically convert this to a `snake_case` filename prefixed with a timestamp.

**Example:**

### **Creating a migration for the `skrull` database:**

```sh
  npm run dbmate:generate -- skrull AddUsersTable
```

This will create a new, empty SQL file at `src/persistence/skrull/migrations/YYYYMMDDHHMMSS_add_users_table.sql`, ready for you to edit.

```sql
  -- migrate:up

  -- migrate:down
```

Defining Migration Logic Inside the migration file, you define the SQL commands to apply (-- migrate:up) and rollback (-- migrate:down) the changes.

Here’s an example migration to create a users table:

```sql
  -- migrate:up
  CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- migrate:down
  DROP TABLE IF EXISTS users;
```

- -- migrate:up: Contains SQL commands to apply the changes.

- -- migrate:down: Contains SQL commands to revert the changes.

Ensure your SQL is accurate and tested to prevent runtime errors. After generating the file, you can open it and add your `migrate:up` and `migrate:down` SQL statements.
