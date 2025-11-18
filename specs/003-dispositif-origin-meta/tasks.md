# Tasks: Dispositif Origin Metadata

**Feature**: Dispositif Origin Metadata (RI-977)
**Status**: In Progress
**Branch**: `003-dispositif-origin-meta`

## Phase 1: Setup

_Project initialization and context preparation._

- [ ] T001 Run `.specify/scripts/bash/update-agent-context.sh windsurf` to refresh AI context

## Phase 2: Foundational (Blocking)

_Core data model and type updates required for all user stories._

- [ ] T002 Update `DispositifResponse`, `GetDispositifResponse`, and `GetAllDispositifsResponse` interfaces in `packages/api-types/src/modules/dispositif.ts` to include `origin` field
- [ ] T003 Update `SimpleDispositif` interface in `packages/api-types/src/generics.ts` to include `origin` field
- [ ] T004 Update Mongoose schema in `apps/server/src/typegoose/Dispositif.ts` to add `origin` property (enum: ["RI", "RCO"], default: "RI", immutable: true)
- [ ] T005 Update `getSimpleDispositifs` in `apps/server/src/modules/dispositif/dispositif.repository.ts` to serialize `origin` (defaulting to "RI")
- [ ] T006 Update `getStructureDispositifs` in `apps/server/src/modules/dispositif/dispositif.repository.ts` to serialize `origin` (defaulting to "RI")
- [ ] T007 Update `createDispositif` workflow in `apps/server/src/workflows/dispositif/createDispositif/createDispositif.ts` to include `origin` in the returned response
- [ ] T008 Update `updateDispositif` workflow in `apps/server/src/workflows/dispositif/updateDispositif/updateDispositif.ts` to include `origin` in the returned response

## Phase 3: User Story 1 - Frontend receives origin context (P1)

_Goal: Frontend receives and displays origin metadata for Dispositifs._

- [ ] T009 [P] [US1] Create `apps/server/src/modules/dispositif/__tests__/dispositif.origin.test.ts` to verify:
  - `origin` field persistence and retrieval (default "RI" on creation, explicit "RCO")
  - `origin` field is returned in `createDispositif` and `updateDispositif` responses
  - `origin` field is immutable on updates
- [ ] T010 [US1] Implement UI badge for RCO origin in `apps/client/src/components/UI/DispositifCard/DispositifCard.tsx`
- [ ] T011 [US1] Update Dispositif Detail page in `apps/client/src/pages/dispositif/[id]/index.tsx` to display origin information if required by design

## Phase 4: User Story 3 - Frontend client maintains backward compatibility (P3)

_Goal: Ensure legacy data and clients continue to function without errors._

- [ ] T012 [P] [US3] Add test case to `apps/server/src/modules/dispositif/__tests__/dispositif.origin.test.ts` ensuring documents missing `origin` field return "RI" in API responses
- [ ] T013 [US3] Manually verify no regressions in search/catalogue pages for existing content

## Phase 5: Polish & Cross-Cutting

_Final cleanup and verification._

- [ ] T014 Ensure all new types are exported and usable across the monorepo
- [ ] T015 Run full test suite `pnpm test` to ensure no regressions in unrelated modules
- [ ] T016 [Mobile] Placeholder: Verify impact on mobile app and plan UI updates for origin display

## Dependencies

1. Phase 2 must be completed before Phase 3 and 4 starts.
2. T002/T003 (Types) should be done before T004/T005/T006/T007/T008 (Server implementation) to ensure type safety.
3. T009 (Tests) can be written in parallel with implementation (TDD).

## Implementation Strategy

- **MVP**: Complete Phase 2 and Phase 3 to enable RCO distinction.
- **Deferred**: User Story 2 (Admin/Backoffice) is out of scope for this iteration.
