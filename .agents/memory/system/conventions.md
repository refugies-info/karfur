---
description: Coding standards, git workflow, and development practices for Réfugiés.info.
---

# Development Conventions

## Coding Style
- **Functional over OOP**: Prefer pure functions, hooks, and composition.
- **TypeScript**: Strict mode required. Avoid `any`. Use explicit return types.
- **Imports**: Use `~` alias for lib imports. Group imports: external, internal (`@refugies-info/*`), local.
- **Styling**: Tailwind CSS is the first choice. Use DSFR tokens (no arbitrary values).

## Git & PR Workflow
- **Branch Naming**: `name/RI-XXXX-description` (Linear) or `001-feature-name` (.specify).
- **Commits**: Conventional Commits v1.0.0 (`feat:`, `fix:`, etc.).
- **PR Process**: Create against `dev`, run tests/lint/types, squash merge.
- **Accessibility Review**: Required for all user-facing changes.

## Testing Discipline
- **Narrow Integration**: Test real behavior with minimal mocks.
- **State-based**: Set up state → Execute → Verify state changes directly in DB.
- **Framework**: Jest for unit and integration tests.

## Monorepo Consistency
- **Package Manager**: pnpm 10.x exclusively.
- **Tooling**: Turborepo for orchestration, Biome for linting/formatting.
- **Shared Packages**: `@refugies-info/api-types`, `@refugies-info/ui`.
