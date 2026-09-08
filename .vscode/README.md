# VS Code Configuration

This directory contains Visual Studio Code settings and configurations tailored for this project.

## Files

### `extensions.json`

This file lists the recommended VS Code extensions for this project. When you open the workspace, VS Code will prompt you to install any recommended extensions that you don't already have.

**Recommended Extensions:**

- `miclo.sort-typescript-imports`: Automatically sorts TypeScript imports.
- `dbaeumer.vscode-eslint`: Integrates ESLint into VS Code.
- `ms-vsliveshare.vsliveshare`: Enables real-time collaborative development.
- `esbenp.prettier-vscode`: Formats code with Prettier.
- `pflannery.vscode-versionlens`: Shows the latest version for each package in `package.json`.
- `ms-vscode-remote.remote-containers`: Allows you to use a Docker container as a full-featured development environment.

### `launch.json`

This file contains configurations for debugging the application within VS Code.

**Debug Configurations:**

- **Run Script: dev:debug**: Launches the application in debug mode by running the `npm run dev:debug` script.
- **Attach to Docker Container**: Attaches the VS Code debugger to a Node.js process running inside a Docker container on port 9230.
- **Run tests**: Executes the test suite in debug mode using the `npm run test:debug` script.
- **Debug Current Test File**: Runs and debugs the currently opened test file using `vitest`.

### `settings.json`

This file contains workspace-specific settings for VS Code. These settings override your user settings when you have this workspace open.

**Settings:**

- **`editor.insertSpaces`**: `true` - Inserts spaces when you press `Tab`.
- **`editor.tabSize`**: `2` - Sets the number of spaces to use for a tab.
- **Live Share Settings**:
  - `liveshare.languages.allowGuestCommandControl`: `true`
  - `liveshare.allowGuestDebugControl`: `true`
  - `liveshare.allowGuestTaskControl`: `true`
  - `liveshare.populateGitCoAuthors`: `"never"`
  - `liveshare.shareExternalFiles`: `true`
  These settings configure the Live Share extension to allow guests more control during a collaboration session.
