# Agent Guidelines for temaki-agent

## Build, Lint & Test Commands

- **Build**: `npm run build` - Compiles TypeScript to `/dist`
- **Start**: `npm start` - Runs compiled server from `/dist/server.js`
- **Dev**: `npm run dev` - Watches src files with ts-node and nodemon
- **Lint**: `npm run lint` - Runs ESLint on all TypeScript files
- **Test**: No tests configured yet (`npm test` will fail)
- **Generate migrations**: `npm run generate` - Generates Drizzle migrations for both local & Turso
- **Migrate**: `npm run migrate` - Applies migrations to both databases

## Code Style Guidelines

**Imports**: Use named imports. Order: Node builtins → external packages → relative imports. ESLint + Prettier enforce standards.

**Formatting**: Prettier with: `semi: true`, `singleQuote: true`, `trailingComma: 'all'`. Tabs for indentation (default).

**Types**: `strict: true` TypeScript mode enforced. Use explicit types for function parameters and returns. Export types with `type` keyword (e.g., `type Execution = InferSelectModel<...>`).

**Naming**: camelCase for variables/functions, PascalCase for types/interfaces, UPPER_SNAKE_CASE for constants. Use descriptive names (avoid abbreviations).

**Error Handling**: Throw errors with descriptive messages. Use Zod for input validation. Pass errors via `next(error)` in Express middleware for centralized handling in `errorHandler`.

**Node target**: ES2020. ESLint + TypeScript plugins enforce best practices.
