---
description: Current technology stack and migration status.
---

# Technology Stack

## Core
- **Runtime**: Node.js 22.x LTS (24.11.1 in dev).
- **Package Manager**: pnpm 10.26.x.
- **Language**: TypeScript ^5.9.2.

## Applications
- **Frontend**: Next.js, React 19, Tailwind CSS 4.x, react-dsfr 1.20.2.
- **Backend**: Express.js, MongoDB 6.20.0, Zod (@zodyac/zod-mongoose).
- **Mobile**: React Native (Expo), Reanimated.

## Quality & Ops
- **Orchestration**: Turborepo 2.6.0.
- **Lint/Format**: Biome 2.3.7 (replaces Prettier/ESLint).
- **Pre-commit**: Husky + lint-staged.
- **CI/CD**: GitHub Actions, GCP (Cloud Build).

## Migration Status
- 🚧 **TypeGoose → Zod**: In progress.
- 🚧 **SCSS → Tailwind**: Ongoing.
- 🚧 **Pages → App Router**: Ongoing.
- 🚧 **Redux → Context API**: Ongoing.
- ✅ **Prettier/ESLint → Biome**: Completed.
