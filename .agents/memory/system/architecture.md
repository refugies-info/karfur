---
description: Monorepo structure and application-specific architectural patterns.
---

# Architecture

## Monorepo Structure (Turborepo + pnpm)
- `apps/client`: Next.js frontend (Pages + App Router).
- `apps/server`: Express.js backend (REST API).
- `apps/mobile`: React Native (Expo).
- `packages/ui`: Shared React components (DSFR-based).
- `packages/api-types`: Shared TypeScript types.
- `packages/mongo`: Shared DB schemas (Zod-based).

## Application Patterns
- **Frontend**: Transitioning to App Router and Context API. Uses `react-dsfr` + Tailwind.
- **Backend**: Module-based Express. Moving from TypeGoose to Zod + Mongoose schemas.
- **Database**: MongoDB (Mongoose). Use the "Omit & Extend" pattern for complex Zod/Mongoose type patching.
- **Translations**: 8 languages managed via i18next. Logic for RTL (logical properties).
