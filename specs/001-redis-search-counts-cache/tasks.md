# Phase 2: Implementation Tasks

**Feature**: Redis Caching for Search Counts API  
**Date**: 2025-10-23  
**Status**: Ready for Implementation  
**Estimated Duration**: 2-3 weeks (5 sprints)  
**Team Size**: 1-2 engineers

---

## Overview

This document contains all implementation tasks organized by user story priority. Each task is independently executable and includes specific file paths for clarity.

**Key Metrics**:
- **Total Tasks**: 28
- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **Phase 3 (US1 - P1)**: 6 tasks
- **Phase 4 (US2 - P2)**: 4 tasks
- **Phase 5 (US4 - P2)**: 5 tasks
- **Phase 6 (US3 - P3)**: 3 tasks
- **Phase 7 (Polish)**: 1 task

---

## Implementation Strategy

### MVP Scope (Recommended First Sprint)
Focus on **User Story 1 (P1)** to deliver core value:
- Basic Redis caching with 5-15 min TTL
- Cache hit/miss tracking
- Graceful degradation if Redis unavailable
- Estimated: 3-4 days for 1 engineer

**Delivers**: <100ms cached responses, 70%+ database load reduction

### Incremental Delivery
1. **Sprint 1**: User Story 1 (P1) - Core caching
2. **Sprint 2**: User Story 2 (P2) - Cache invalidation
3. **Sprint 3**: User Story 4 (P2) - Rate limiting & debouncing
4. **Sprint 4**: User Story 3 (P3) - Tiered caching & monitoring
5. **Sprint 5**: Polish, testing, deployment

---

## Dependencies & Parallelization

### User Story Dependencies
```
US1 (P1) ─────────────────┐
                           ├─→ US2 (P2) ─┐
                           │              ├─→ US3 (P3)
US4 (P2) ─────────────────┘              │
                                         └─→ Deployment
```

**Parallelizable**:
- US1 and US4 can be developed in parallel (independent)
- US2 depends on US1 (needs cache layer)
- US3 depends on US1 (needs cache layer)

---

## Phase 1: Setup & Infrastructure (Days 1-2)

### Prerequisites
- [ ] T001 Create Google Cloud Memorystore HA instance in europe-west1 region with Redis 7.0
- [ ] T002 Configure Cloud Load Balancer with Cloud Armor rate limiting policy (10 req/sec per IP, 60s ban)
- [ ] T003 [P] Set up environment variables in `.env.local` and deployment configuration (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CACHE_TTL_SECONDS)
- [ ] T004 [P] Install dependencies: `pnpm add ioredis pino pino-stackdriver node-cache`

**Success Criteria**:
- ✅ Memorystore instance running and accessible
- ✅ Cloud Load Balancer configured with rate limiting
- ✅ Environment variables set correctly
- ✅ All dependencies installed

---

## Phase 2: Foundational Infrastructure (Days 3-4)

### Core Cache Layer
- [ ] T005 Create Redis connection module at `apps/client/src/libs/redis.ts` with connection pooling, retry strategy, and error handling
- [ ] T006 Create cache abstraction layer at `apps/client/src/libs/cache.ts` with `getCached()`, `setCached()`, `invalidateByFilters()` functions
- [ ] T007 Create cache invalidation logic at `apps/client/src/libs/cacheInvalidation.ts` with `invalidateOnDispoChange()` function
- [ ] T008 [P] Create structured logging module at `apps/client/src/libs/logger.ts` using pino with Cloud Logging transport
- [ ] T009 [P] Create TypeScript types for cache operations at `apps/client/src/types/cache.ts` (CacheEntry, CacheKey, SearchCountsResponse)

**Success Criteria**:
- ✅ Redis connection established and tested
- ✅ Cache layer abstracts Redis operations
- ✅ Structured logging configured
- ✅ All modules have proper error handling and logging

---

## Phase 3: User Story 1 - Cache Search Counts Results (P1) (Days 5-8)

**Goal**: Implement basic Redis caching for GET `/api/search/counts` endpoint to reduce database load and improve response times.

**Independent Test**: Query same filter combination twice; verify second request <100ms without MongoDB aggregation.

### Implementation Tasks
- [ ] T010 [US1] Integrate cache layer into `apps/client/src/pages/api/search/counts.ts`: wrap `computeSearchCounts()` with cache get/set logic
- [ ] T011 [US1] Add cache response headers to API response: `X-Cache-Hit`, `X-Cache-Age`, `X-Cache-TTL` in `apps/client/src/pages/api/search/counts.ts`
- [ ] T012 [P] [US1] Create unit tests for cache layer at `apps/client/src/libs/__tests__/cache.test.ts` (get, set, key generation, TTL)
- [ ] T013 [P] [US1] Create integration tests for API caching at `apps/client/src/pages/api/search/__tests__/counts-cache.test.ts` (cache hit/miss scenarios)
- [ ] T014 [US1] Add cache hit/miss logging to API route in `apps/client/src/pages/api/search/counts.ts` with structured logs
- [ ] T015 [US1] Implement graceful degradation: if Redis unavailable, fall back to direct MongoDB query without blocking

**Success Criteria**:
- ✅ Cached responses complete in <100ms
- ✅ Cache hit rate >80% for repeated queries
- ✅ Database load reduced by 70%+ (measured by query count)
- ✅ All tests passing
- ✅ Graceful fallback if Redis unavailable
- ✅ Structured logs show cache operations

---

## Phase 4: User Story 2 - Invalidate Cache on Data Changes (P2) (Days 9-11)

**Goal**: Implement selective cache invalidation when dispositif data changes to ensure data consistency.

**Independent Test**: Create/update/delete dispositif; verify cache cleared and next query returns fresh data.

### Implementation Tasks
- [ ] T016 [US2] Implement cache invalidation on dispositif creation in `apps/server/src/workflows/dispositif/createDispositif/createDispositif.ts` (call invalidation logic)
- [ ] T017 [US2] Implement cache invalidation on dispositif update in `apps/server/src/workflows/dispositif/updateDispositif/updateDispositif.ts` (invalidate old + new attributes)
- [ ] T018 [US2] Implement cache invalidation on dispositif status change in `apps/server/src/workflows/dispositif/updateDispositifStatus/updateDispositifStatus.ts`
- [ ] T019 [P] [US2] Create unit tests for cache invalidation logic at `apps/client/src/libs/__tests__/cacheInvalidation.test.ts` (selective invalidation, attribute matching)

**Success Criteria**:
- ✅ Cache invalidated within 100ms of dispositif change
- ✅ Only affected filter combinations invalidated (80%+ reduction in unnecessary invalidations)
- ✅ Unaffected cache entries remain valid
- ✅ All tests passing
- ✅ Structured logs show invalidation events

---

## Phase 5: User Story 4 - Debouncing and Rate Limiting (P2) (Days 12-14)

**Goal**: Implement client-side debouncing and server-side rate limiting to prevent cache thrashing.

**Independent Test**: Send 10 requests in 1 second; verify rate limiting returns 429 for excess requests.

### Implementation Tasks
- [ ] T020 [US4] Implement client-side debouncing in `apps/client/src/components/SearchFilters.tsx` with 300-500ms delay on search input changes
- [ ] T021 [US4] Create debounced search counts hook at `apps/client/src/hooks/useSearchCounts.ts` with configurable debounce delay
- [ ] T022 [US4] Add rate limit response headers to API route in `apps/client/src/pages/api/search/counts.ts`: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] T023 [US4] Add rate limiting error handling in `apps/client/src/pages/api/search/counts.ts` to return 429 with `Retry-After` header
- [ ] T024 [P] [US4] Create integration tests for rate limiting at `apps/client/src/pages/api/search/__tests__/counts-rate-limit.test.ts` (verify 429 responses, header validation)

**Success Criteria**:
- ✅ Client-side debouncing reduces unique cache keys by 60%+ during search input
- ✅ Rate limiting reduces redundant API calls by 50%+
- ✅ Rate-limited requests return 429 within 10ms
- ✅ All tests passing
- ✅ Rate limit headers present in responses

---

## Phase 6: User Story 3 - Tiered Caching with Graceful Degradation (P3) (Days 15-17)

**Goal**: Implement per-container in-memory cache as fallback and add comprehensive monitoring.

**Independent Test**: Simulate Redis unavailability; verify API returns cached results from in-memory cache within 150ms.

### Implementation Tasks
- [ ] T025 [US3] Create in-memory cache layer at `apps/client/src/libs/memoryCache.ts` using node-cache with LRU eviction and 1-5 min TTL
- [ ] T026 [US3] Integrate in-memory cache into `apps/client/src/libs/cache.ts` as write-through fallback (write to both Redis and in-memory)
- [ ] T027 [US3] Create Cloud Monitoring dashboard at `apps/client/monitoring/search-counts-dashboard.json` showing Memorystore metrics, cache hit rates, latency, and database impact

**Success Criteria**:
- ✅ In-memory cache serves requests when Redis unavailable
- ✅ Response latency <150ms during Redis outage
- ✅ Memory footprint <100MB per container
- ✅ Monitoring dashboard shows cache performance metrics
- ✅ Cache hit rate >80% combined (Redis + in-memory)

---

## Phase 7: Polish & Cross-Cutting Concerns (Days 18-19)

### Final Tasks
- [ ] T028 Create comprehensive documentation at `apps/client/docs/SEARCH_COUNTS_CACHE.md` with architecture diagram, deployment guide, troubleshooting, and monitoring queries

**Success Criteria**:
- ✅ Documentation complete and accurate
- ✅ Deployment guide tested
- ✅ Troubleshooting guide covers common issues
- ✅ Monitoring queries work in Cloud Logging

---

## Testing Strategy

### Unit Tests (Per-Component)
- **Cache layer**: `apps/client/src/libs/__tests__/cache.test.ts`
  - Cache key generation consistency
  - Get/set operations
  - TTL expiration
  - Error handling

- **Cache invalidation**: `apps/client/src/libs/__tests__/cacheInvalidation.test.ts`
  - Selective invalidation logic
  - Attribute matching
  - Multi-language support

- **Debouncing hook**: `apps/client/src/hooks/__tests__/useSearchCounts.test.ts`
  - Debounce delay enforcement
  - Multiple rapid calls collapse to single request
  - Error handling

### Integration Tests (End-to-End)
- **API caching**: `apps/client/src/pages/api/search/__tests__/counts-cache.test.ts`
  - Cache hit on repeated queries
  - Cache miss on first query
  - TTL expiration triggers fresh query
  - Graceful degradation if Redis unavailable

- **Rate limiting**: `apps/client/src/pages/api/search/__tests__/counts-rate-limit.test.ts`
  - 429 response when limit exceeded
  - Rate limit headers present
  - Per-IP tracking

- **Cache invalidation**: `apps/client/src/pages/api/search/__tests__/counts-invalidation.test.ts`
  - Cache cleared on dispositif create/update/delete
  - Only affected entries invalidated
  - Unaffected entries remain valid

### Load Testing
- Use k6 to simulate 100 concurrent users
- Verify cache hit rate >80%
- Verify response latency <100ms for cached requests
- Verify database load reduced by 70%+

---

## Deployment Checklist

- [ ] Memorystore HA instance created and tested
- [ ] Cloud Load Balancer configured with rate limiting
- [ ] Environment variables set in production
- [ ] Redis connection tested in staging
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Load testing completed with success criteria met
- [ ] Cloud Monitoring dashboard created
- [ ] Cloud Logging queries configured
- [ ] Alerts configured for anomalies
- [ ] Documentation complete
- [ ] Team trained on monitoring and troubleshooting
- [ ] Deployment to production
- [ ] Post-deployment verification (cache hit rate, latency, database load)

---

## Success Metrics

### Performance
- **Cached response latency**: <100ms (p99)
- **Cache hit rate**: >80% (combined Redis + in-memory)
- **Database load reduction**: 70%+ (fewer queries)
- **Rate-limited response latency**: <10ms

### Reliability
- **Memorystore HA failover**: <1s downtime
- **In-memory cache fallback**: <150ms response time during Redis outage
- **Graceful degradation**: Falls back to database if both caches unavailable

### Observability
- **Cache metrics**: Visible in Cloud Monitoring within 5 minutes
- **Structured logs**: All cache operations logged to Cloud Logging
- **Audit trail**: Complete history of cache operations

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Redis connection failure** | Medium | High | Graceful fallback to database; in-memory cache as secondary layer |
| **Cache stampede** | Low | High | Memorystore HA + write-through in-memory cache keeps cache warm |
| **Memory exhaustion** | Low | High | LRU eviction in in-memory cache; max 100MB per container |
| **Stale data** | Low | Medium | TTL expiration (5-15 min) + explicit invalidation on mutations |
| **Rate limiting misconfiguration** | Low | Medium | Cloud Load Balancer handles; test in staging first |
| **Monitoring blind spots** | Medium | Medium | Structured logging + Cloud Logging queries provide visibility |

---

## Next Steps

1. ✅ Specification complete
2. ✅ Plan complete
3. ✅ Phase 0 research complete
4. ✅ Phase 1 design complete
5. ⏳ **Phase 2: Execute tasks in priority order (US1 → US2 → US4 → US3)**
6. ⏳ Phase 3: Testing & deployment
7. ⏳ Phase 4: Post-deployment monitoring & optimization

**Status**: Ready for implementation! 🚀

---

## Task Execution Guide

### For Sprint Planning
1. Group tasks by phase (1-7)
2. Assign Phase 1-2 to first sprint (foundational)
3. Assign Phase 3 to second sprint (MVP - US1)
4. Assign Phase 4-5 to third sprint (parallel - US2 + US4)
5. Assign Phase 6 to fourth sprint (US3)
6. Assign Phase 7 to fifth sprint (polish)

### For Parallel Execution
- **Sprint 2**: Tasks T005-T009 can run in parallel (different files)
- **Sprint 3**: Tasks T012-T013 can run in parallel (different test files)
- **Sprint 4**: Tasks T016-T019 can run in parallel (different files)
- **Sprint 5**: Tasks T020-T024 can run in parallel (different files)

### For Code Review
Each task should be reviewed for:
- ✅ Correct file paths
- ✅ Proper error handling
- ✅ Structured logging
- ✅ Test coverage
- ✅ TypeScript type safety
- ✅ Prettier formatting compliance
