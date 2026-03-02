# Husky Setup Guide for Angular Project

This guide explains how to set up and use Husky Git hooks in this Angular project.

## Installation

Run the following commands to install the required dependencies:

```bash
# Install Husky and related tools
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional

# Initialize Husky (this sets up the .husky directory)
npx husky init

# Install ESLint for Angular (if not already installed)
npm install -D @angular-eslint/schematics
npx ng add @angular-eslint/schematics
```

## What's Configured

### Git Hooks

1. **pre-commit** - Runs before each commit
   - Executes `lint-staged` to lint and format staged files
   - Only processes files that are being committed

2. **commit-msg** - Validates commit message format
   - Ensures commits follow conventional commit standards
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

3. **pre-push** - Runs before pushing to remote
   - Runs a development build to ensure code compiles
   - Prevents pushing broken code

### Available Scripts

```bash
# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix

# Format all files
npm run format

# Check formatting without changes
npm run format:check
```

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect the code meaning (formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
# Good commit messages
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(cart): resolve incorrect total calculation"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format code with prettier"
git commit -m "refactor(core): simplify service architecture"

# Bad commit messages (will be rejected)
git commit -m "fixed stuff"
git commit -m "WIP"
git commit -m "update"
```

## Bypassing Hooks (Use with Caution)

In rare cases, you might need to bypass hooks:

```bash
# Skip pre-commit hooks
git commit -m "message" --no-verify

# Skip pre-push hooks
git push --no-verify
```

⚠️ **Warning**: Only bypass hooks when absolutely necessary. They exist to maintain code quality.

## Troubleshooting

### Hooks Not Running

1. Ensure Husky is installed: `npm install`
2. Check if `.husky` directory exists
3. Verify hooks are executable (Unix/Mac): `chmod +x .husky/*`

### Lint-Staged Errors

If lint-staged fails on commit:

```bash
# Run lint manually to see errors
npm run lint

# Run format manually
npm run format
```

### Build Fails on Pre-Push

```bash
# Run build manually to see errors
npm run build

# Fix errors before pushing
```

## File Configurations

### `.commitlintrc.json`
Configures commit message validation rules.

### `.lintstagedrc.json`
Defines which commands run on which file types during pre-commit.

### `.husky/`
Contains Git hook scripts:
- `pre-commit` - Lint staged files
- `commit-msg` - Validate commit message
- `pre-push` - Run build

## Best Practices

1. **Write meaningful commit messages** - They serve as documentation
2. **Keep commits small** - Easier to review and revert if needed
3. **Fix lint errors immediately** - Don't let them accumulate
4. **Run tests before committing** - Don't rely solely on hooks
5. **Use appropriate commit types** - Helps with changelog generation

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
