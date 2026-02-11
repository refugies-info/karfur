---
description: Essential pnpm and turbo commands for daily development.
---

# Commands

## Development
- `pnpm dev`: Start all services.
- `pnpm dev:client`: Start client + UI.
- `pnpm dev:server`: Start server.

## Quality
- `pnpm lint`: Run Biome check.
- `pnpm check:types`: Run TypeScript type checking.
- `pnpm test`: Run all tests.

## Build & Release
- `pnpm build`: Build all packages.
- `pnpm pr:stg:[client|server]`: Create staging PR.
- `pnpm pr:prod:[client|server]`: Create production PR.
