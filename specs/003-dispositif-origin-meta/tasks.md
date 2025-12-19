# Tasks: Dispositif Origin Metadata

**Feature**: Dispositif Origin Metadata (RI-977)
**Status**: In Progress
**Branch**: `003-dispositif-origin-meta`

## Phase 1: Setup

_Project initialization and context preparation._

- [x] T001 Run `.specify/scripts/bash/update-agent-context.sh windsurf` to refresh AI context

## Phase 2: Foundational (Blocking)

_Core data model and type updates required for all user stories._

- [x] T002 Update `DispositifResponse`, `GetDispositifResponse`, and `GetAllDispositifsResponse` interfaces in `packages/api-types/src/modules/dispositif.ts` to include `origin` field
- [x] T002a Update `GetDispositifsRequest` and `CountDispositifsRequest` in `packages/api-types/src/modules/dispositif.ts` to include optional `origin` filter (Note: `SearchDispositifsRequest` does not exist in the codebase - search is client-side)
- [x] T003 Update `SimpleDispositif` interface in `packages/api-types/src/generics.ts` to include `origin` field
- [x] T004 Update Mongoose schema in `apps/server/src/typegoose/Dispositif.ts` to add `origin` property (enum: ["RI", "RCO"], default: "RI", immutable: true)
- [x] T004a Run `pnpm migrate new --name backfill-origin-ri` to generate migration file
- [x] T004b Implement migration logic in `migrations/<timestamp>_backfill-origin-ri.ts` to set `origin: "RI"` on all existing documents in `dispositifs` collection
- [x] T005 Update `getDispositifs` workflow in `apps/server/src/workflows/dispositif/getDispositifs/getDispositifs.ts` to handle the optional `origin` filter and update `getSimpleDispositifs` in `apps/server/src/modules/dispositif/dispositif.repository.ts` to serialize `origin` (defaulting to "RI")
- [x] T005a Update client-side search filters in `apps/client/src/lib/recherche/filterContents.ts` to support filtering by `origin` (Note: search is client-side, not server-side)
- [x] T005b Update `formatForAlgolia` in `apps/server/src/libs/formatForAlgolia.ts` to include `origin` field in Algolia objects for client-side search filtering
- [x] T006 Update `getStructureDispositifs` in `apps/server/src/modules/dispositif/dispositif.repository.ts` to serialize `origin` (defaulting to "RI")
- [x] T007 Update `createDispositif` workflow in `apps/server/src/workflows/dispositif/createDispositif/createDispositif.ts` to include `origin` in the returned response
- [x] T008 Update `updateDispositif` workflow in `apps/server/src/workflows/dispositif/updateDispositif/updateDispositif.ts` to include `origin` in the returned response

## Phase 3: User Story 1 - Frontend receives origin context (P1)

_Goal: Frontend receives and displays origin metadata for Dispositifs._

- [x] T009 [P] [US1] Create `apps/server/src/modules/dispositif/__tests__/dispositif.origin.test.ts` to verify:
  - `origin` field persistence and retrieval (default "RI" on creation, explicit "RCO")
  - `origin` field is returned in `createDispositif` and `updateDispositif` responses
  - `origin` field is immutable on updates
- [x] T010 [US1] Implement UI badge for RCO origin in `apps/client/src/components/UI/DispositifCard/DispositifCard.tsx`. MUST use DSFR badge styles and include accessible label (sr-only or aria-label). (Note: No translation keys needed as RCO content is French-only).
- [x] T011 [US1] Update Dispositif Detail page in `apps/client/src/pages/dispositif/[id]/index.tsx` to display origin information.

## Phase 4: User Story 3 - Frontend client maintains backward compatibility (P3)

_Goal: Ensure legacy data and clients continue to function without errors._

- [x] T012 [P] [US3] Add test case to `apps/server/src/modules/dispositif/__tests__/dispositif.origin.test.ts` ensuring documents missing `origin` field return "RI" in API responses
- [x] T013 [US3] Manually verify no regressions in search/catalogue pages for existing content (Smoke test: Load homepage, perform search, view detail page of legacy item).

## Phase 5: Polish & Cross-Cutting

_Final cleanup and verification._

- [ ] T014 Ensure all new types are exported and usable across the monorepo
- [x] T015 Run full test suite `pnpm test` to ensure no regressions in unrelated modules
- [x] T016 [Mobile] Update `Dispositif` type definition in `apps/mobile` to include `origin` field (sync with `api-types`)
- [x] T016a [Mobile] Create `OriginBadge` component in `apps/mobile/src/components/OriginBadge.tsx` (using DSFR colors/styles adapted for RN)
- [x] T016b [Mobile] Update search result items (e.g., `src/components/Search/Hit.tsx`) to display `OriginBadge` when `origin === "RCO"`
- [x] T016c [Mobile] Update Dispositif Detail screen to display `OriginBadge`
- [ ] T017 [Docs] Verify generated API documentation (Swagger/OpenAPI) reflects the new `origin` field (FR-007)
- [ ] T018 [Analytics] Update `exportFiches` and `getStatistics` to include `origin` field in read-only outputs (FR-005)

## Dependencies

1. Phase 2 must be completed before Phase 3 and 4 starts.
2. T002/T003 (Types) should be done before T004/T005/T006/T007/T008 (Server implementation) to ensure type safety.
3. T009 (Tests) can be written in parallel with implementation (TDD).

## Implementation Strategy

- **MVP**: Complete Phase 2 and Phase 3 to enable RCO distinction.
- **Deferred**: User Story 2 (Admin/Backoffice) is out of scope for this iteration.
