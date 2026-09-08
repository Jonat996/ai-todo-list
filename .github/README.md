# GitHub Workflows

This directory contains the GitHub Actions workflows for the project.

## Workflows

### 🦉 Flatten Repository

**File:** `flatten_repo.yml`

This workflow generates a flattened version of the repository, combining all source code into a single timestamped text file. This is useful for providing context to large language models.

**Triggers:**

- `push` to `development` branches (triggers on every commit).
- `workflow_dispatch` for manual execution.

**Jobs:**

- **`flatten-and-commit`**:
  - Runs on `ubuntu-latest`.
  - Requires `contents: write` permissions.
  - **Steps:**
    1. **Harden Runner**: Secures the action runner.
    2. **Checkout repository**: Clones the repository using `PAT_FLATTEN` (if configured) or `GITHUB_TOKEN`.
    3. **Generate flattened file**: Executes `scripts/flatten_repo.sh` to create a file named `flattened_Skrull_YYYYMMDD-HHMMSS.txt`.
    4. **Validate generated file**: Verifies the file exists, has reasonable size (>1000 bytes), and contains the expected header.
    5. **Commit and push**: Removes old flattened files, commits the new one with `[skip ci]` tag to prevent infinite loops, and pushes to the remote.

**Important Notes:**

- The workflow includes `[skip ci]` in commit messages to prevent triggering itself and causing infinite loops.
- For protected branches (like `development`), the `PAT_FLATTEN` secret must be configured with:
  - `repo` scope (full repository access)
  - Admin role or bypass permissions for branch protection rules
- Old flattened files are automatically removed; only the most recent file is kept in the repository.
- The script excludes common build artifacts, dependencies, and binary files (see `scripts/flatten_repo.sh` for details).

### Run lint, build and tests

**File:** `superchek-and-test.yml`

This workflow runs the linter, build, and tests for the project.

**Triggers:**

- `push` to any branch.

**Jobs:**

- **`lint-build-test`**:
  - Runs on `ubuntu-latest`.
  - **Steps:**
    1. **Checkout**: Clones the repository.
    2. **Setup Node.js**: Sets up the Node.js environment to version 22.x.
    3. **Install dependencies**: Installs project dependencies using `npm ci`.
    4. **Lint**: Runs the linter.
    5. **Build**: Compiles the project.
    6. **Test**: Runs the tests.
