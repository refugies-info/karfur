# Tasks: Enhance Location Search UX

**Input**: Design documents from `/specs/001-enhance-location-search/`  
**Branch**: `001-enhance-location-search`  
**Tech Stack**: TypeScript 5.x, React 18, Next.js 14+, Redux, react-dsfr, Tailwind CSS  
**Testing Framework**: Jest, React Testing Library, Playwright (E2E)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create helper functions file at `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T002 [P] Create TypeScript interfaces for API responses in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T003 [P] Create test utilities and mock data for location search in `apps/client/src/components/Pages/recherche/LocationMenu/__mocks__/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Implement `transformMunicipalityResult()` function in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T005 [P] Implement `transformDepartmentResult()` function in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T006 [P] Implement `sortByRelevance()` function in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T007 Add `UnifiedSearchResult` interface to `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T008 Create mock API responses for both municipality and department APIs in `apps/client/src/components/Pages/recherche/LocationMenu/__mocks__/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick City Search with Auto-Suggest (Priority: P1) 🎯 MVP

**Goal**: Enable users to search for cities and see both city and department results in auto-suggest dropdown with clear distinction

**Independent Test**: Type "Paris" in location search field and verify both city and department results appear with proper labels

### Tests for User Story 1

- [X] T009 [P] [US1] Unit test for `transformMunicipalityResult()` in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/functions.test.ts`
- [X] T010 [P] [US1] Unit test for `transformDepartmentResult()` in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/functions.test.ts`
- [X] T011 [P] [US1] Unit test for `sortByRelevance()` in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/functions.test.ts`
- [X] T012 [US1] Integration test for dual API search flow in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.integration.test.tsx`
- [X] T013 [US1] E2E test for city search with Playwright in `apps/client/e2e/recherche-location-search.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Update `onChangeDepartmentInput` callback to call both APIs in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx` (lines 56-88)
- [X] T015 [P] [US1] Implement result merging logic in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T016 [US1] Update state type from `any[]` to `UnifiedSearchResult[]` in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx` (line 44)
- [X] T017 [US1] Update `onSelectPrediction` callback to handle `UnifiedSearchResult` type in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx` (lines 95-115)
- [X] T018 [US1] Update RadioButtons rendering to display merged results with type distinction in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx` (lines 176-189)
- [X] T019 [US1] Add error handling for API failures in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T020 [US1] Add loading state during API calls in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T021 [US1] Verify screen reader announcements work with merged results in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently. Users can search for cities and see both city and department results.

---

## Phase 4: User Story 2 - Change Default Filter Label to "Ville" (Priority: P1)

**Goal**: Update the default location filter label from "Département" to "Ville" to better reflect user expectations

**Independent Test**: Load search page with no location selected and verify filter button displays "Ville" instead of "Département"

### Tests for User Story 2

- [X] T022 [US2] Unit test for locationLabel computation in `apps/client/src/components/Pages/recherche/SearchHeader/__tests__/Filters.test.tsx`
- [X] T023 [US2] E2E test for default label display in `apps/client/e2e/recherche-location-label.spec.ts`
- [X] T024 [US2] Update `locationLabel` default from "Département" to "Ville" in `apps/client/src/components/Pages/recherche/SearchHeader/Filters.tsx` (line 120)
- [X] T025 [US2] Verify label still shows selected department name after selection in `apps/client/src/components/Pages/recherche/SearchHeader/Filters.tsx`
- [X] T026 [US2] Test label change with different screen sizes (mobile-first) in `apps/client/src/components/Pages/recherche/SearchHeader/Filters.tsx`

**Checkpoint**: User Story 2 complete. Filter button now displays "Ville" by default, improving UX clarity.

---

## Phase 5: User Story 3 - Department Search Fallback (Priority: P2)

**Goal**: Enable users to search directly for department names and see department results in auto-suggest list

**Independent Test**: Type "Rhône" in location search field and verify department results appear in suggestions

### Tests for User Story 3

- [X] T027 [P] [US3] Unit test for department API response transformation in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/functions.test.ts`
- [X] T028 [US3] Integration test for department-only search in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.integration.test.tsx`
- [X] T029 [US3] E2E test for department search with Playwright in `apps/client/e2e/recherche-department-search.spec.ts`
- [X] T030 [US3] Verify department API call works independently in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T031 [US3] Ensure department results are properly distinguished in UI (e.g., "(Département)" label) in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T032 [US3] Test department selection updates Redux with correct department name in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T033 [US3] Verify URL is updated with department code after department selection in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`

**Checkpoint**: All user stories should now be independently functional. Users can search by city or department, and results are properly distinguished.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

### Styling & Visual Distinction

- [X] T034 [P] Add CSS classes for city vs. department result distinction in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.module.css`
- [X] T035 [P] Ensure responsive design for mobile-first UX in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.module.css`

### Department Search Priority Fix

- [X] T034a [US3] Fix department search priority to show departments when searching for department names in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T034b [US3] Fix accent handling in department search to handle both "rhone" and "rhône" queries in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T034c [US3] Fix hyphen/space handling for multi-word departments like "Ille-et-Vilaine" in `apps/client/src/components/Pages/recherche/LocationMenu/functions.ts`
- [X] T034d [US3] Fix radio button checked state when selecting departments in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T034e [US3] Add screen reader vocalization for not-deployed departments in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`

### Edge Cases & Error Handling

- [X] T036 Handle empty search results gracefully in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T037 Handle API timeout scenarios in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T038 Handle special characters and accents in search queries in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T039 Verify short queries (< 3 characters) are properly filtered in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`

### Accessibility & Performance

- [X] T040 Verify keyboard navigation works with merged results in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T041 Test screen reader announcements with various result counts in `apps/client/src/components/Pages/recherche/LocationMenu/LocationMenu.tsx`
- [X] T042 Performance test: Verify search response time < 1 second in `apps/client/e2e/recherche-performance.spec.ts`
- [X] T043 Performance test: Verify debounce behavior (500ms) prevents excessive API calls in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.integration.test.tsx`

### Regression Testing

- [X] T044 [P] Verify existing location filter functionality preserved in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.regression.test.tsx`
- [X] T045 [P] Verify common places still display when search field is empty in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.regression.test.tsx`
- [X] T046 [P] Verify URL updates correctly with department code in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.regression.test.tsx`
- [X] T047 Verify Redux integration works correctly in `apps/client/src/components/Pages/recherche/LocationMenu/__tests__/LocationMenu.integration.test.tsx`

### Validation Tasks
- [X] T084 Verify unlimited locations can be selected
- [X] T085 Test horizontal scrolling appears when needed
- [X] T086 Verify selection order is chronological

### Documentation & Validation

- [X] T048 Update component documentation in `apps/client/src/components/Pages/recherche/LocationMenu/README.md` (create if needed)
- [X] T049 Run quickstart.md validation to ensure implementation matches guide in `specs/001-enhance-location-search/quickstart.md`
- [X] T050 Code cleanup and refactoring in `apps/client/src/components/Pages/recherche/LocationMenu/`

---

## Phase 7: User Story Updates (Priority: P1)

### Label Change Tasks
- [X] T051 Update default label to "Localité" in Filters.tsx (line 120)
- [X] T052 Update related translation keys if needed
- [X] T053 Test label change across all screen sizes

### Multi-Select Implementation
- [X] T054 Update UnifiedSearchResult interface to track selection state
- [X] T055 Modify LocationMenu state to track multiple selections
- [X] T056 Convert RadioButtons to Checkboxes for multi-select
- [X] T057 Implement selection/deselection handlers
- [X] T058 Update Filters component to display multiple selections
- [X] T059 Modify URL handling for comma-separated department codes
- [X] T060 Ensure backward compatibility with single department codes

### Multi-Select Tests
- [X] T061 Unit tests for multi-select state management
- [X] T062 Integration tests for multi-select UI behavior
- [X] T063 E2E tests for multi-select workflow
- [X] T064 Accessibility tests for multi-select announcements

### Checkbox Implementation Tasks
- [X] T071 Replace RadioButton with DSFR Checkbox component
- [X] T072 Implement checkbox group accessibility attributes
- [X] T073 Add keyboard navigation support
- [X] T074 Update visual styling for checkbox list
- [X] T075 Verify screen reader announcements
- [X] T076 Test checkbox behavior across devices

### State Management Updates
- [X] T077 Modify Redux store for array of selections
- [X] T078 Update URL parameter serialization
- [X] T079 Implement selection persistence

### Polish & Validation
- [X] T065 Update component documentation
- [X] T066 Verify no regressions in existing functionality
- [X] T067 Performance test with multiple selections

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) and User Story 2 (P1) can proceed in parallel after Foundational
  - User Story 3 (P2) can start after Foundational, or after US1 completes
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
  - Independent Test: Type "Paris" → See city and department results
  - MVP deliverable: Dual API search with merged results
  
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
  - Independent Test: Load page → See "Ville" label
  - Quick win: Single line change in Filters.tsx
  
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 infrastructure
  - Independent Test: Type "Rhône" → See department results
  - Extends US1 functionality

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation follows test-driven approach
- Story complete when all acceptance scenarios pass
- Story independent when it can be tested without other stories

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003 can run in parallel (different files)

**Phase 2 (Foundational)**:
- T005, T006, T007 can run in parallel (different functions)
- T004 must complete before T008

**Phase 3 (User Story 1)**:
- T009, T010, T011 can run in parallel (unit tests for different functions)
- T014, T015 can run in parallel (different parts of component)
- Tests must complete before implementation

**Phase 4 (User Story 2)**:
- Can start immediately after Foundational completes
- Can run in parallel with Phase 3 (different files)
- T022, T023 can run in parallel (different test types)

**Phase 5 (User Story 3)**:
- Can start after Foundational completes
- Can run in parallel with Phase 3 & 4 (different test scenarios)
- T027, T028, T029 can run in parallel (different test types)

**Phase 6 (Polish)**:
- T034, T035 can run in parallel (different CSS concerns)
- T036-T039 can run in parallel (different edge cases)
- T044-T047 can run in parallel (different regression tests)

---

## Parallel Example: User Story 1 Implementation

```bash
# After Foundational phase completes:

# Launch all unit tests in parallel:
Task T009: Unit test for transformMunicipalityResult()
Task T010: Unit test for transformDepartmentResult()
Task T011: Unit test for sortByRelevance()

# After tests pass, launch implementation tasks in parallel:
Task T014: Update onChangeDepartmentInput callback
Task T015: Implement result merging logic

# Then sequential tasks:
Task T016: Update state type
Task T017: Update onSelectPrediction callback
Task T018: Update RadioButtons rendering
Task T019: Add error handling
Task T020: Add loading state
Task T021: Verify accessibility
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

**Recommended for fastest delivery**

1. Complete Phase 1: Setup (15 min)
2. Complete Phase 2: Foundational (60 min)
3. Complete Phase 3: User Story 1 (120 min)
   - Write tests first (30 min)
   - Implement dual API search (60 min)
   - Verify accessibility (30 min)
4. Complete Phase 4: User Story 2 (15 min)
   - Single line change + tests
5. **STOP and VALIDATE**: Test both stories independently
6. Deploy/demo if ready

**Total MVP time**: ~3.5 hours

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (75 min)
2. Add User Story 1 → Test independently → Deploy/Demo (120 min) **MVP!**
3. Add User Story 2 → Test independently → Deploy/Demo (15 min)
4. Add User Story 3 → Test independently → Deploy/Demo (90 min)
5. Complete Polish phase → Final validation (90 min)

**Total time**: ~6 hours

### Parallel Team Strategy (3 developers)

With multiple developers:

1. **Developer A + B + C**: Complete Setup + Foundational together (75 min)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (120 min)
   - **Developer B**: User Story 2 (15 min) + then assist with US3
   - **Developer C**: Polish phase prep (edge cases, styling)
3. Stories complete and integrate independently
4. **All**: Polish phase (90 min)

**Total time**: ~3.5 hours (parallel execution)

---

## Success Criteria Checklist

### User Story 1 Complete When:
- [X] Both city and department results appear in auto-suggest
- [X] Results are sorted by relevance (exact matches first)
- [X] Results limited to 5 items
- [X] Results clearly distinguished (city vs. department)
- [X] Department code stored in URL
- [X] Screen reader announcements work
- [X] All unit tests pass
- [X] Integration tests pass
- [X] E2E tests pass

### User Story 2 Complete When:
- [X] Filter button displays "Ville" by default
- [X] Filter button shows selected department name after selection
- [X] Works on mobile and desktop
- [X] All tests pass

### User Story 3 Complete When:
- [X] Department search returns department results
- [X] Department results properly distinguished
- [X] Department selection updates Redux
- [X] URL updated with department code
- [X] All tests pass

### Overall Feature Complete When:
- [X] All 3 user stories complete
- [X] All edge cases handled
- [X] Performance targets met (< 1 second)
- [X] Accessibility verified (RGAA 4)
- [X] No regressions in existing functionality
- [X] All tests pass (unit, integration, E2E)
- [X] Code reviewed and approved

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Write tests FIRST, ensure they FAIL before implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Use quickstart.md as implementation guide for code examples
- Refer to data-model.md for data structures and transformations
- Refer to contracts/ for API response formats
