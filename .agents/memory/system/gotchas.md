---
description: Known issues, edge cases, and common pitfalls.
---

# Gotchas

- **DSFR CSS Layer**: Requires a custom patch to avoid conflicts with Tailwind. Patch `@codegouvfr/react-dsfr` when updating.
- **Client Build**: Prerendering in `pnpm build:client` often requires the server to be running.
- **Zod-Mongoose Unions**: Library has trouble with unions; use the "Omit & Extend" pattern (Type Patching) instead of `z.any()`.
- **Pre-commit Hooks**: Biome auto-formats on commit. If a commit fails, `git add` the changes and try again.
