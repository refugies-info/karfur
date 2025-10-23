# Tasks: Redis Caching for Search Counts API

**Input**: Design documents from `/specs/001-redis-search-counts-cache/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Feature Branch**: `001-redis-search-counts-cache`
**Estimated Duration**: 2-3 weeks (4 sprints)

**Organization**: Tasks are grouped by user story (P1, P2, P2) to enable independent implementation and testing of each story. Architecture: Redis HA only (per research.md decision) - no per-instance in-memory cache.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and infrastructure setup

- [ ] T001 Create Google Cloud Memorystore HA instance in europe-west1 region with Redis 7.0, 2GB size, standard tier
- [ ] T002 Configure Cloud Load Balancer with Cloud Armor rate limiting policy (10 req/sec per IP, 60s ban duration)
- [ ] T003 [P] Set up environment variables in `.env.local` and deployment configuration (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CACHE_TTL_SECONDS)
- [ ] T004 [P] Install dependencies at monorepo root: `pnpm add ioredis pino pino-stackdriver node-cache`
- [ ] T005 [P] Create shared cache package at `packages/cache/` with structure: `src/`, `package.json`, `tsconfig.json`, `README.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create Redis connection module in `packages/cache/src/redis.ts` with connection pooling, retry strategy, error handling, and event listeners
- [ ] T007 Create cache abstraction layer in `packages/cache/src/cache.ts` with `getCached()`, `setCached()`, `invalidateByFilters()` functions and SHA-256 key generation
- [ ] T008 Create cache invalidation logic in `packages/cache/src/cacheInvalidation.ts` with `invalidateOnDispoChange()` function for dispositif mutations
- [ ] T009 [P] Create TypeScript types for cache operations in `packages/cache/src/types.ts` (CacheEntry, CacheKey, SearchCountsResponse, CacheMetrics)
- [ ] T010 [P] Create package exports and documentation in `packages/cache/src/index.ts` and `packages/cache/README.md`
- [ ] T011 [P] Update `packages/cache/package.json` with dependencies (ioredis, pino) and export configuration
- [ ] T012 [P] Add `@refugies-info/cache` to `apps/client/package.json` and `apps/server/package.json` as dependency

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Cache Search Counts Results (Priority: P1) 🎯 MVP

**Goal**: Implement basic Redis caching for GET `/api/search/counts` endpoint to reduce database load by 70%+ and improve response times from 500ms+ to <100ms.

**Independent Test**: Query same filter combination twice; verify second request completes in <100ms without executing MongoDB aggregation.

### Tests for User Story 1

- [ ] T013 [P] [US1] Create unit tests for cache layer at `packages/cache/__tests__/cache.test.ts` (cache key generation, get/set operations, TTL expiration, error handling)
- [ ] T014 [P] [US1] Create integration tests for API caching at `apps/client/src/pages/api/search/__tests__/counts-cache.test.ts` (cache hit/miss scenarios, TTL expiration, graceful degradation)

### Implementation for User Story 1

- [ ] T015 [US1] Integrate cache layer into `apps/client/src/pages/api/search/counts.ts`: import from `@refugies-info/cache`, wrap `computeSearchCounts()` with cache get/set logic
- [ ] T016 [US1] Add cache response headers to API response in `apps/client/src/pages/api/search/counts.ts`: `X-Cache-Hit`, `X-Cache-Age`, `X-Cache-TTL`
- [ ] T017 [US1] Add cache hit/miss logging to API route in `apps/client/src/pages/api/search/counts.ts` with structured logs (operation, key, hit, latency_ms)
- [ ] T018 [US1] Implement graceful degradation in `apps/client/src/pages/api/search/counts.ts`: if Redis unavailable, fall back to direct MongoDB query without blocking

**Checkpoint**: User Story 1 is fully functional and independently testable. Delivers <100ms cached responses and 70%+ database load reduction.

---

## Phase 4: User Story 2 - Invalidate Cache on Data Changes (Priority: P2)

**Goal**: Implement selective cache invalidation when dispositif data changes to ensure data consistency without unnecessary invalidations.

**Independent Test**: Create/update/delete dispositif; verify cache cleared for affected filter combinations and next query returns fresh data from MongoDB.

### Tests for User Story 2

- [ ] T019 [P] [US2] Create unit tests for cache invalidation logic at `packages/cache/__tests__/cacheInvalidation.test.ts` (selective invalidation, attribute matching, multi-language support)
- [ ] T020 [P] [US2] Create integration tests for cache invalidation at `apps/server/src/modules/dispositif/__tests__/cache-invalidation.test.ts` (invalidation on create/update/delete, affected vs unaffected entries)

### Implementation for User Story 2

**Architecture**: Server detects dispositif mutations (via database events or workflow hooks) and invalidates Redis cache directly using shared cache package. Cache layer is shared between client and server via `@refugies-info/cache`.

- [ ] T021 [US2] Add cache invalidation call in `apps/server/src/workflows/dispositif/createDispositif/createDispositif.ts`: after dispositif creation, import from `@refugies-info/cache` and call invalidation with new dispositif attributes
- [ ] T022 [US2] Add cache invalidation calls in `apps/server/src/workflows/dispositif/updateDispositifStatus/updateDispositifStatus.ts`: on status change (CREATED, PUBLISHED, DELETED, ARCHIVED), import from `@refugies-info/cache` and call invalidation with both old and new attributes

**Checkpoint**: User Stories 1 AND 2 are both independently functional. Cache invalidation occurs within 100ms of dispositif change with 80%+ reduction in unnecessary invalidations.

---

## Phase 5: User Story 4 - Debouncing and Rate Limiting (Priority: P2)

**Goal**: Implement client-side debouncing and server-side rate limiting to prevent cache thrashing from rapid successive queries.

**Independent Test**: Send 10 requests in 1 second; verify rate limiting returns 429 for excess requests and debouncing collapses multiple rapid calls into single request.

### Tests for User Story 4

- [ ] T023 [P] [US4] Create integration tests for rate limiting at `apps/client/src/pages/api/search/__tests__/counts-rate-limit.test.ts` (verify 429 responses, rate limit headers, per-IP tracking)
- [ ] T024 [P] [US4] Create tests for debouncing hook at `apps/client/src/hooks/__tests__/useSearchCounts.test.ts` (debounce delay enforcement, multiple rapid calls collapse to single request)

### Implementation for User Story 4

- [ ] T025 [US4] Implement client-side debouncing in `apps/client/src/components/SearchFilters.tsx` with 300-500ms delay on search input changes
- [ ] T026 [US4] Create debounced search counts hook at `apps/client/src/hooks/useSearchCounts.ts` with configurable debounce delay and error handling
- [ ] T027 [US4] Add rate limit response headers to API route in `apps/client/src/pages/api/search/counts.ts`: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] T028 [US4] Add rate limiting error handling in `apps/client/src/pages/api/search/counts.ts` to return 429 with `Retry-After` header when Cloud Armor rate limit exceeded

**Checkpoint**: User Stories 1, 2, AND 4 are independently functional. Client-side debouncing reduces unique cache keys by 60%+; rate limiting reduces redundant API calls by 50%+. All three user stories complete.

---

## Phase 6: Monitoring & Observability (Cross-Cutting)

**Purpose**: Add comprehensive monitoring and observability for production operations

**Goal**: Implement Cloud Monitoring dashboard and structured logging to track cache performance, database impact, and system health.

### Implementation

- [ ] T029 Create Cloud Monitoring dashboard at `apps/client/monitoring/search-counts-dashboard.json` showing Memorystore metrics (memory usage, commands/sec, eviction rate, replication lag), cache hit rates, latency (p50, p95, p99), database query impact, and connection status
- [ ] T030 [P] Configure Cloud Logging queries at `apps/client/docs/MONITORING_QUERIES.md` for cache hit rate analysis, latency tracking, database load reduction measurement, and rate limit violation tracking
- [ ] T031 [P] Set up alerting rules in Cloud Monitoring for anomalies: Redis connection failures, cache hit rate <80%, response latency >150ms, database load increase >20%

**Checkpoint**: Production monitoring in place. Visibility into cache performance, database impact, and system health.

---

## Phase 7: Polish & Documentation

**Purpose**: Final documentation and validation before deployment

- [ ] T032 Create comprehensive documentation at `packages/cache/README.md` with API reference, usage examples, and integration guide for both client and server apps
- [ ] T033 Create comprehensive documentation at `apps/client/docs/SEARCH_COUNTS_CACHE.md` with architecture diagram (Redis HA + shared cache package), deployment guide, troubleshooting, monitoring queries, and performance tuning
- [ ] T034 [P] Run quickstart.md validation: verify all steps work end-to-end with local Redis Docker setup
- [ ] T035 [P] Run load testing with k6: simulate 100 concurrent users, verify cache hit rate >80%, response latency <100ms, database load reduced by 70%+
- [ ] T036 Create deployment runbook at `apps/client/docs/DEPLOYMENT_RUNBOOK.md` with pre-deployment checklist, deployment steps, rollback procedure, and post-deployment verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Depends on US1 cache layer but independently testable
  - User Story 4 (P2): Can start after Foundational - Independent of US1 and US2
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Setup (Phase 1)
    ↓
Foundational (Phase 2)
    ↓
    ├─→ US1 (P1) ─────────────┐
    │                          ├─→ US2 (P2) ─┐
    ├─→ US4 (P2) ─────────────┘              │
    │                                        ↓
    └─────────────────────────→ Monitoring & Observability
                                        ↓
                        Polish & Documentation (Phase 7)
```

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation tasks follow test-driven development (TDD)
- Story complete before moving to next priority
- Each story independently testable and deployable

### Parallel Opportunities

**Phase 1 (Setup)**:

- All [P] tasks can run in parallel (T003, T004)

**Phase 2 (Foundational)**:

- All [P] tasks can run in parallel (T008, T009)
- T005, T006, T007 have dependencies but can start after T001-T004

**Phase 3 (US1)**:

- Tests (T010, T011) can run in parallel
- Implementation (T012-T015) sequential due to dependencies

**Phase 4 (US2)**:

- Tests (T016, T017) can run in parallel
- Implementation (T018-T020) can run in parallel (different files)

**Phase 5 (US4)**:

- Tests (T021, T022) can run in parallel
- Implementation (T023-T026) can run in parallel (different files)

**Phase 6 (Monitoring)**:

- All tasks (T027-T029) can run in parallel (different files)

**Parallel Team Strategy** (with 2-3 developers):

1. Team completes Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - Developer A: User Story 1 (P1) - MVP
   - Developer B: User Story 4 (P2) - Rate limiting
   - Developer C: User Story 2 (P2) - Cache invalidation
3. After US1-US4 complete, team works on Monitoring & Observability (Phase 6)
4. All stories complete and integrate independently

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (1 day)
2. Complete Phase 2: Foundational (1 day)
3. Complete Phase 3: User Story 1 (3-4 days)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**Delivers**: <100ms cached responses, 70%+ database load reduction, >80% cache hit rate

### Incremental Delivery (Recommended)

1. **Sprint 1**: Setup + Foundational → Foundation ready
2. **Sprint 2**: User Story 1 (P1) → Test independently → Deploy/Demo (MVP!)
3. **Sprint 3**: User Story 2 (P2) + User Story 4 (P2) in parallel → Test independently → Deploy/Demo
4. **Sprint 4**: Monitoring & Observability + Polish & documentation → Final deployment

Each story adds value without breaking previous stories.

---

## Success Criteria

### User Story 1 (P1) - Cache Search Counts Results

- ✅ Cached responses complete in <100ms (p99)
- ✅ Cache hit rate >80% for repeated queries
- ✅ Database query load reduced by 70%+ (measured by query count)
- ✅ All unit and integration tests passing
- ✅ Graceful fallback if Redis unavailable
- ✅ Structured logs show cache operations

### User Story 2 (P2) - Invalidate Cache on Data Changes

- ✅ Cache invalidated within 100ms of dispositif change
- ✅ Only affected filter combinations invalidated (80%+ reduction in unnecessary invalidations)
- ✅ Unaffected cache entries remain valid and serve from cache
- ✅ All unit and integration tests passing
- ✅ Structured logs show invalidation events with trigger and affected keys

### User Story 4 (P2) - Debouncing and Rate Limiting

- ✅ Client-side debouncing reduces unique cache keys by 60%+ during search input
- ✅ Rate limiting reduces redundant API calls by 50%+
- ✅ Rate-limited requests return 429 within 10ms
- ✅ Rate limit headers present in all responses
- ✅ All unit and integration tests passing

### Monitoring & Observability

- ✅ Cloud Monitoring dashboard shows Memorystore metrics and cache performance
- ✅ Cloud Logging queries track cache hit rate, latency, and database impact

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Use exact file paths from plan.md project structure
- Follow Prettier formatting rules (printWidth: 120, semi: true, singleQuote: false, trailingComma: all)
- All code must follow TypeScript strict mode

---

## Metrics

| Metric | Count | Status |
|--------|-------|--------|
| **Total Functional Requirements** | 18 | ✅ All mapped to tasks |
| **Total Success Criteria** | 15 | ✅ All measurable |
| **Total User Stories** | 3 | ✅ All independently testable |
| **Total Tasks** | 39 | ✅ All properly formatted |
| **Shared Packages** | 1 | ✅ @refugies-info/cache |
