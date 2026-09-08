## Husky

In this folder we can find three Git hooks which are task automation scripts, apply custom rules and check conditions.

```typescript
if ! head -1 "$1" | grep -qE "^(feat|fix|ci|chore|docs|test|style|refactor|perf|build|revert)(\(.+?\))?: .{1,}$"; then
    echo "Aborting commit. Your commit message is invalid." >&2
    exit 1
fi
```

This `hook` allows us to guarantee that the commits have a correct structure using the `comment Flags` or else it will not allow us to send the commit and will show us this message `"Aborting commit. Your commit message is invalid."`.

This would be an example of how the commit should be done:

```
git commit -am "docs: edited readme for mappings"
```

### Comment Flags

These are the flags with which commits are made from the github console:

- `feat`: Confirmations that add a new feature.

- `ci`: confimations of changes in the integrations.

- `revert`: confirmations that indicate that the commit performs a rollback of a previous commit

- `fix`: Confirmations that resolve an error or an update.

- `refactor`: Confirmations that it rewrites/restructures the code but does not change any behavior.

- `perf`: Special refactoring statements that improve performance..

- `style`: Confirmations that do not affect the meaning, such as blank spaces, formatting, missing semicolons, etc.

- `test`: Confirmations that add missing test or fix existing tests

- `docs`: Confirmations that only affect the documentation.

- `build`: Confirmations that affect build components, such as build tools, CIpipeline.

- `chore`: confirmations various, such as the modification of .gitignore or the update of branches against development.

The second hook is in charge of giving a limit of characters to the commit, if it exceeds the limit it will give us this message: `Aborting commit. Your commit message is too long.`.

```typescript
if ! head -1 "$1" | grep -qE "^.{1,88}$"; then
    echo "Aborting commit. Your commit message is too long." >&2
    exit 1
fi
```

The third hook is responsible for ensuring that the code that is sent has good practices, has no errors, and complies with the linting rules, this is a lint-staged tool that is responsible for improving the quality of the code.

```typescript
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
npx lint-staged

```
