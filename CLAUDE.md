# Karfu'R / Refugies.info

Monorepo (pnpm + turbo) for refugies.info:

- `apps/client` — Next.js frontend
- `apps/server` — Node backend
- `apps/mobile` — React Native app
- `apps/storybook` — component storybook
- `packages/api-types` — TypeScript types shared across client/server/mobile
- `packages/ui` — shared, documented UI primitives
- `packages/mongo`, `packages/markdown-utils`, `packages/sentry`, `packages/typescript-config` — other shared packages

Full docs live in [`documentation/`](documentation/README.md) (client, server, api-types) and [`CONTRIBUTING.md`](CONTRIBUTING.md) (branching, PR process, semantic commits). Read those before making structural changes — this file only summarizes the coding conventions to apply on every change (see RI-1437).

## Coding conventions

- **Language**: everything (code, comments, commit messages, PR/issue text) is in **English**.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for classes and React components, `camelCase` feature folders. Only named exports. Prefer a longer, descriptive name over a short, cryptic one.
- **Comments**: write self-explanatory code first — good code shouldn't need comments. When you do comment, keep it short and in English, and reserve it for what the code can't say by itself (an exception, a workaround, a non-obvious rule) — not a restatement of what the line does.
- **Don't repeat yourself**: refactor to reuse an existing function instead of copy-pasting; avoid growing the codebase for no reason.
- **Typing**: every new/touched file should be fully typed (TypeScript on client and server).
- **i18n**: never hardcode user-facing text. Use `next-i18next` (`useTranslation`/`t(...)`), add the key to `public/locales/[lang]/common.json`, and mention that new keys need exporting/regenerating (`pnpm client:i18n:export` / `client:i18n:import`) — see [`documentation/client/i18n.md`](documentation/client/i18n.md).
- **Front components**:
  - stay free of business logic — they receive what to display via props, do purely presentational reformatting locally, and leave business rules to callers/hooks.
  - never import or fetch data directly — data is loaded upstream (page/container/hook) and passed down as props.
  - see [`documentation/client/component-composition.md`](documentation/client/component-composition.md) for composition patterns.
- **Styling**: SCSS modules + Tailwind/DSFR tokens, see [`documentation/client/styling.md`](documentation/client/styling.md). `:global()` selectors targeting react-dsfr's own BEM classes (double underscore, e.g. `fr-fieldset__content`) legitimately need `/* stylelint-disable-next-line selector-class-pattern */` right above the line — this is an existing, accepted pattern in the codebase, not something to work around another way.
- **Logging**: `logger.info/warn/error("[functionName]", { data })` (server); never log in render (client).

## Before committing

- `pnpm lint` / `pnpm lint:style` / `pnpm test` for what you touched.
- Commit messages follow the semantic prefixes in [`CONTRIBUTING.md`](CONTRIBUTING.md#semantic-git-commit-messages) (`feat`, `fix`, `chore`, `docs`, `refactor`, `style`, `test`).
- The `pre-push` hook runs `pnpm security:scan:js` (CVE scan, fails on high/critical). Don't disable or route around this script — if it blocks an unrelated change, flag it instead of silencing it.
