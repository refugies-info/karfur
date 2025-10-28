# Tasks: Redis Caching for Search Counts API

**Input**: Design documents from `/specs/001-redis-search-counts-cache/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Feature Branch**: `001-redis-search-counts-cache`
**Estimated Duration**: 2-3 weeks (4 sprints)

**Organization**: Tasks are grouped by user story (P1, P2, P2) to enable independent implementation and testing of each story. Architecture: Redis HA only (per research.md decision) - no per-instance in-memory cache.

**Existing Implementation Context**:
- Basic `SearchCountsContext.tsx` exists at `apps/client/src/components/Pages/recherche/SearchCountsContext.tsx`
- Provides simple context with `useSearchCounts()` hook for data access
- Current flow: Redux → SearchHeader component → Context → Filter components
- New implementation should enhance existing context, not replace it
- New hook name changed to `useSearchCountsCache.ts` to avoid naming conflicts

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and infrastructure setup

- [ ] T001 Create Google Cloud Memorystore HA instance in europe-west1 region with Redis 7.0, 2GB size, standard tier
- [ ] T002 Configure application-level rate limiting using @upstash/ratelimit with Redis backend (10 req/sec per IP, 60s ban duration)
- [ ] T003 [P] Set up environment variables in `.env.local` and deployment configuration (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CACHE_TTL_SECONDS)
- [ ] T004 [P] Create infrastructure package directory and basic package setup: `mkdir -p packages/infra/src/cache packages/infra/src/logger`, create `packages/infra/package.json` with workspace configuration, and `packages/infra/tsconfig.json`
- [ ] T005 [P] Install dependencies in infra package: `cd packages/infra && pnpm add ioredis pino @google-cloud/pino-logging-gcp-config @upstash/ratelimit`
- [ ] T006 [P] Create shared infrastructure package structure: `src/cache/`, `src/logger/`, `index.ts` (public API) with proper folder organization
- [ ] T007 [P] Install shared infra package in client app: `cd apps/client && pnpm add @refugies-info/infra@workspace:*`
- [ ] T008 [P] Install shared infra package in server app: `cd apps/server && pnpm add @refugies-info/infra@workspace:*`
- [ ] T009 [P] Create logger module in `packages/infra/src/logger/` with pino configuration, @google-cloud/pino-logging-gcp-config, and structured logging setup for Cloud Logging with service context
- [ ] T010 Create Redis connection module in `packages/infra/src/cache/redis.ts` with connection pooling, retry strategy, error handling, and event listeners
- [ ] T011 [P] Create core cache abstraction in `packages/infra/src/cache/main.ts` with get/set/delete operations, TTL handling, graceful fallback to MongoDB, and performance logging
- [ ] T012 [P] Create selective cache invalidation module in `packages/infra/src/cache/invalidation.ts` with attribute matching logic, multi-language support, and bulk invalidation capabilities
- [ ] T013 [P] Create TypeScript types for cache operations in `packages/infra/src/cache/types.ts` (CacheEntry, CacheKey, SearchCountsResponse, CacheMetrics)
- [ ] T014 [P] Create public interface exports in `packages/infra/src/index.ts` and `packages/infra/src/cache/index.ts` with proper documentation

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 2: User Story 1 - Cache Search Counts Results (Priority: P1) 🎯 MVP

**Goal**: Implement basic Redis caching for GET `/api/search/counts` endpoint to reduce database load by 70%+ and improve response times from 500ms+ to <100ms.

**Independent Test**: Query same filter combination twice; verify second request completes in <100ms without executing MongoDB aggregation.

### Tests for User Story 1

- [ ] T016 [P] [US1] Create unit tests for cache layer at `packages/infra/src/cache/__tests__/main.test.ts` (cache key generation, get/set operations, TTL expiration, error handling)
- [ ] T017 [P] [US1] Create unit tests for cache invalidation at `packages/infra/src/cache/__tests__/invalidation.test.ts` (selective invalidation, attribute matching, multi-language support)
- [ ] T018 [P] [US1] Create unit tests for Redis connection at `packages/infra/src/cache/__tests__/redis.test.ts` (connection handling, retry logic, error scenarios)
- [ ] T019 [P] [US1] Create unit tests for logger at `packages/infra/src/logger/__tests__/gcp-logger.test.ts` (structured logging, GCP integration, error reporting)
- [ ] T020 [P] [US1] Create integration tests for package at `packages/infra/__tests__/integration.test.ts` (end-to-end cache operations, logging integration, shared package usage)
- [ ] T021 [P] [US1] Create integration tests for API caching at `apps/client/src/pages/api/search/__tests__/counts-cache.test.ts` (cache hit/miss scenarios, TTL expiration, graceful degradation)

### Implementation for User Story 1

- [ ] T015 [US1] Implement caching logic in Next.js API route `apps/client/src/pages/api/search/counts.ts` using cache library from `@refugies-info/infra`, include cache key generation, Redis operations, MongoDB fallback, and error handling
- [ ] T022 [US1] Integrate cache layer into `apps/client/src/pages/api/search/counts.ts`: import from `@refugies-info/infra`, wrap `computeSearchCounts()` with cache get/set logic
- [ ] T023 [US1] Add cache response headers to API response in `apps/client/src/pages/api/search/counts.ts`: `X-Cache-Hit`, `X-Cache-Age`, `X-Cache-TTL`
- [ ] T024 [US1] Add cache hit/miss logging to API route in `apps/client/src/pages/api/search/counts.ts` with structured logs using `@refugies-info/infra` logger (operation, key, hit, latency_ms)
- [ ] T025 [US1] Implement graceful degradation in `apps/client/src/pages/api/search/counts.ts`: if Redis unavailable, fall back to direct MongoDB query without blocking

**Checkpoint**: User Story 1 is fully functional and independently testable. Delivers <100ms cached responses and 70%+ database load reduction.

---

## Phase 3: User Story 2 - Invalidate Cache on Data Changes (Priority: P2)

**Goal**: Implement selective cache invalidation when dispositif data changes to ensure data consistency without unnecessary invalidations.

**Independent Test**: Create/update/delete dispositif; verify cache cleared for affected filter combinations and next query returns fresh data from MongoDB.

### Tests for User Story 2

- [ ] T026 [P] [US2] Create unit tests for cache invalidation logic at `packages/infra/src/cache/__tests__/invalidation.test.ts` (selective invalidation, attribute matching, multi-language support)
- [ ] T027 [P] [US2] Create integration tests for cache invalidation at `apps/server/src/modules/dispositif/__tests__/cache-invalidation.test.ts` (invalidation on create/update/delete, affected vs unaffected entries)

### Implementation for User Story 2

**Architecture**: Server detects dispositif mutations (via database events or workflow hooks) and invalidates Redis cache using shared `@refugies-info/infra` package. Both client and server apps depend on the shared infrastructure package. Rate limiting implemented at application level using @upstash/ratelimit with Redis backend, suitable for Cloud Run container environment.

- [ ] T028 [US2] Add cache invalidation call in `apps/server/src/workflows/dispositif/createDispositif/createDispositif.ts`: after dispositif creation, import from `@refugies-info/infra` and call invalidation with new dispositif attributes
- [ ] T029 [US2] Add cache invalidation calls in `apps/server/src/workflows/dispositif/updateDispositifStatus/updateDispositifStatus.ts`: on status change (CREATED, PUBLISHED, DELETED, ARCHIVED), import from `@refugies-info/infra` and call invalidation with both old and new attributes

**Checkpoint**: User Stories 1 AND 2 are both independently functional. Cache invalidation occurs within 100ms of dispositif change with 80%+ reduction in unnecessary invalidations.

---

## Phase 4: User Story 3 - Debouncing and Rate Limiting (Priority: P2)

**Goal**: Implement client-side debouncing and server-side rate limiting to prevent cache thrashing from rapid successive queries.

**Independent Test**: Send 10 requests in 1 second; verify rate limiting returns 429 for excess requests and debouncing collapses multiple rapid calls into single request.

### Tests for User Story 3

- [ ] T030 [P] [US3] Create integration tests for rate limiting at `apps/client/src/pages/api/search/__tests__/counts-rate-limit.test.ts` (verify 429 responses, rate limit headers, per-IP tracking)
- [ ] T031 [P] [US3] Create tests for debouncing hook at `apps/client/src/hooks/__tests__/useSearchCountsCache.test.ts` (test new enhanced hook, not existing context hook; verify debounce delay enforcement, multiple rapid calls collapse to single request, cache hit/miss scenarios, rate limit handling)

### Implementation for User Story 3

- [ ] T032 [US3] Implement client-side debouncing in `apps/client/src/components/SearchFilters.tsx` with 300-500ms delay on search input changes
- [ ] T033 [US3] Create enhanced debounced search counts hook at `apps/client/src/hooks/useSearchCountsCache.ts` with configurable debounce delay, cache-aware logic, and error handling. **Note**: Existing `SearchCountsContext.tsx` provides basic data access; new hook should wrap existing context and add Redis caching features (debouncing, cache headers, rate limit awareness, graceful degradation). Maintain backward compatibility with existing components.
- [ ] T034 [US3] Add rate limit response headers to API route in `apps/client/src/pages/api/search/counts.ts`: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` using @upstash/ratelimit
- [ ] T035 [US3] Add rate limiting error handling in `apps/client/src/pages/api/search/counts.ts` to return 429 with `Retry-After` header when rate limit exceeded using @upstash/ratelimit

**Checkpoint**: User Stories 1, 2, AND 3 are independently functional. Client-side debouncing reduces unique cache keys by 60%+; rate limiting reduces redundant API calls by 50%+. All three user stories complete.

---

## Phase 5: Monitoring & Observability (Cross-Cutting)

**Purpose**: Add comprehensive monitoring and observability for production operations

**Goal**: Implement Cloud Monitoring dashboard and structured logging to track cache performance, database impact, and system health.

### Implementation

- [ ] T036 Implement metrics collection for cache operations in `packages/infra/src/cache/metrics.ts` with cache hit/miss rate tracking, operation latency measurement, and Redis connection status monitoring. Export metrics via Prometheus client library or Google Cloud Monitoring API.
- [ ] T037 Create Cloud Monitoring dashboard at `apps/client/monitoring/search-counts-dashboard.json` and deploy with `gcloud monitoring dashboards create --config-file=apps/client/monitoring/search-counts-dashboard.json` showing Memorystore metrics (memory usage, commands/sec, eviction rate, replication lag), cache hit rates, latency (p50, p95, p99), database query impact, and connection status
- [ ] T038 [P] Configure Cloud Logging queries at `apps/client/docs/MONITORING_QUERIES.md` for cache hit rate analysis, latency tracking, database load reduction measurement, and rate limit violation tracking. These queries can be run directly in the Cloud Logging console or saved as saved queries for repeated analysis.
- [ ] T039 [P] Set up alerting rules in Cloud Monitoring for anomalies: Redis connection failures, cache hit rate <80%, response latency >150ms, database load increase >20%

**Checkpoint**: Production monitoring in place. Visibility into cache performance, database impact, and system health.

---

## Phase 6: Polish & Documentation

**Purpose**: Final documentation and validation before deployment

- [ ] T040 Create comprehensive documentation at `packages/infra/README.md` with API reference, usage examples, and integration guide for both client and server apps
- [ ] T041 Create comprehensive documentation at `apps/client/docs/SEARCH_COUNTS_CACHE.md` with architecture diagram (Redis HA + shared cache package), deployment guide, troubleshooting, monitoring queries, and performance tuning
- [ ] T042 [P] Run quickstart.md validation: verify all steps work end-to-end with local Redis Docker setup
- [ ] T043 [P] Run load testing with k6: simulate 100 concurrent users, verify cache hit rate >80%, response latency <100ms, database load reduced by 70%+
- [ ] T044 Create deployment runbook at `apps/client/docs/DEPLOYMENT_RUNBOOK.md` with pre-deployment checklist, deployment steps, rollback procedure, and post-deployment verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Stories (Phase 2-4)**: All depend on Setup phase completion
  - User Story 1 (P1): Can start after Setup - No dependencies on other stories
  - User Story 2 (P2): Can start after Setup - Depends on US1 cache layer but independently testable
  - User Story 3 (P2): Can start after Setup - Independent of US1 and US2
- **Monitoring & Observability (Phase 5)**: Depends on user stories being complete
- **Polish & Documentation (Phase 6)**: Depends on all desired user stories being complete

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

- All [P] tasks can run in parallel (T003-T009, T011-T014)

**Phase 2 (US1)**:

- Tests (T016-T021) can run in parallel
- Implementation (T015, T022-T025) sequential due to dependencies

**Phase 3 (US2)**:

- Tests (T026-T027) can run in parallel
- Implementation (T028-T029) can run in parallel (different files)

**Phase 4 (US3)**:

- Tests (T030-T031) can run in parallel
- Implementation (T032-T035) can run in parallel (different files)

**Phase 5 (Monitoring)**:

- All tasks (T036-T039) can run in parallel (different files)

**Parallel Team Strategy** (with 2-3 developers):

1. Team completes Setup together (Phase 1)
2. Once Setup is done:
   - Developer A: User Story 1 (P1) - MVP (Phase 2)
   - Developer B: User Story 3 (P2) - Rate limiting (Phase 4)
   - Developer C: User Story 2 (P2) - Cache invalidation (Phase 3)
3. After US1-US3 complete, team works on Monitoring & Observability (Phase 5)
4. All stories complete and integrate independently

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (1 day)
2. Complete Phase 2: User Story 1 (3-4 days)
3. **STOP and VALIDATE**: Test User Story 1 independently
4. Deploy/demo if ready

**Delivers**: <100ms cached responses, 70%+ database load reduction, >80% cache hit rate

### Incremental Delivery (Recommended)

1. **Sprint 1**: Setup → Foundation ready (Phase 1)
2. **Sprint 2**: User Story 1 (P1) → Test independently → Deploy/Demo (MVP!) (Phase 2)
3. **Sprint 3**: User Story 2 (P2) + User Story 3 (P2) in parallel → Test independently → Deploy/Demo (Phase 3-4)
4. **Sprint 4**: Monitoring & Observability + Polish & documentation → Final deployment (Phase 5-6)

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

### User Story 3 (P2) - Debouncing and Rate Limiting

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
| **Total Functional Requirements** | 14 | ✅ All mapped to tasks |
| **Total Success Criteria** | 15 | ✅ All measurable |
| **Total User Stories** | 3 | ✅ All independently testable (US1, US2, US3) |
| **Total Tasks** | 44 | ✅ All properly formatted |
| **Shared Packages** | 1 | ✅ @refugies-info/infra |
