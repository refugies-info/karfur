# Implementation Plan: Dispositif Origin Metadata

**Branch**: `003-dispositif-origin-meta` | **Date**: 2025-11-18 | **Spec**: [/specs/003-dispositif-origin-meta/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dispositif-origin-meta/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add a required `origin` enum (`RI`, `RCO`) to every dispositif record, default legacy entries to `RI`, and propagate the metadata through shared types (`DispositifResponse` and `SimpleDispositif`), Mongo models, and all API responses the frontend consumes so UI logic can distinguish editorial versus AI-assisted content without breaking existing flows. `SimpleDispositif` is used extensively in frontend search/filtering (83+ matches).

## Technical Context

**Language/Version**: TypeScript on Node.js 22.x (monorepo standard)
**Primary Dependencies**: Next.js Pages Router (apps/client), Express/Mongoose stack (apps/server), `@refugies-info/api-types` for shared DTOs
**Storage**: MongoDB (existing dispositifs collection)
**Testing**: Jest + Testing Library; server narrow-integration tests hitting Mongo fixture DB
**Target Platform**: Next.js web frontend + Express API deployed on Google Cloud Run
**Project Type**: Web frontend + backend API within Turborepo monorepo
**Performance Goals**: Preserve current catalogue/search p95 latency (<500 ms) and avoid increasing response payload size by more than 2%
**Constraints**: Backward-compatible schema changes only; no manual editor work; origin defaults handled server-side
**Scale/Scope**: ~8k existing dispositifs, multi-language catalogue traffic across FR and 7 refugee languages

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Accessibility First**: Data-only change; frontend will continue to leverage DSFR components and the new origin badge logic will reuse existing accessible patterns → **PASS**.
- **Multilingual by Design**: No new translatable strings introduced; metadata simply surfaces in existing localized flows → **PASS**.
- **Progressive Migration Strategy**: Work happens in modern TS/React/Next stack with existing hooks; no reintroduction of legacy patterns → **PASS**.
- **Monorepo Consistency**: Shared types live in `@refugies-info/api-types`, client/server updates occur in their respective apps with pnpm → **PASS**.
- **Government Standards Compliance**: Frontend badges will use DSFR/Tailwind tokens only → **PASS**.
- **Mobile-First**: Origin metadata feeds responsive components already optimized for mobile → **PASS**.

## Project Structure

### Documentation (this feature)

```
specs/003-dispositif-origin-meta/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 entity + state design
├── quickstart.md        # Phase 1 implementation playbook
├── contracts/           # Phase 1 API contracts (frontend/server)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```
apps/
├── server/
│   └── src/
│       ├── modules/dispositif/
│       │   ├── dispositif.repository.ts
│       │   └── dispositif.service.ts
│       ├── controllers/
│       │   └── dispositifController.ts
│       ├── typegoose/
│       │   └── Dispositif.ts
│       └── modules/search/
├── client/
│   └── src/
│       ├── pages/dispositif/[id]/index.tsx
│       ├── pages/recherche.tsx
└── storybook/

packages/
├── api-types/
│   └── src/modules/dispositif.ts


tests/
├── apps/server/modules/dispositif/__tests__/
└── apps/client/src/features/__tests__/dispositif/
```

**Structure Decision**: Work spans the existing server module that owns dispositifs, the client catalogue/detail routes, and the shared API types package so a single monorepo change-set can update persistence, contracts, and UI consumers. Storybook + tests directories ensure UI badges/rendering are validated without coupling to pages.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Phase 0 – Research & Unknowns

1. Confirm Mongo schema update path (enum + default) and whether migrations need to rewrite existing documents vs. rely on read-time default.
2. Inventory every API/SSR fetch path delivering dispositifs to guarantee origin flows through each serializer/DTO.
3. Decide on safest rollout order (types → backend → frontend) and document fallback behavior for missing origin fields.

_Output_: `research.md` with decisions, rationale, and alternatives for schema/migration/API propagation.

## Phase 1 – Design, Data Model & Contracts

1. Capture dispositif + origin entity details and lifecycle constraints in `data-model.md`.
2. Produce updated REST/DTO contracts in `contracts/` for catalogue list/detail/search endpoints.
3. Author `quickstart.md` covering implementation sequence, testing strategy, and verification steps.
4. Run `.specify/scripts/bash/update-agent-context.sh windsurf` so future AI assistance reflects new tech context.

## Phase 2 – Implementation Prep

1. Ensure research + design artifacts are committed before `/speckit.tasks`.
2. Re-run Constitution Check post-design; expect continued compliance.
3. Provide remaining open questions/risks as input to task planning.
