# Feature Specification: Redis Caching for Search Counts API

**Feature Branch**: `001-redis-search-counts-cache`
**Created**: 2025-10-23
**Status**: Draft
**Input**: User description: "Implement Redis caching for search counts API using Google Cloud Memorystore to improve performance. The GET /api/search/counts endpoint (Next.js route in client app) currently performs direct MongoDB aggregations on every request without caching, causing high database load and slow response times."

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Cache Search Counts Results (Priority: P1)

As an admin user querying the search counts API, I want the system to cache results so that repeated queries with the same filters return quickly without hitting the database every time.

**Why this priority**: This is the core value proposition. Without caching, the API remains slow under load. Implementing basic caching directly solves the performance problem identified in production testing.

**Independent Test**: Can be fully tested by querying the same filter combination multiple times and verifying the second request completes in under 100ms while the first may take longer. Delivers immediate performance improvement.

**Acceptance Scenarios**:

1. **Given** Redis cache is empty, **When** client calls GET /api/search/counts with filters (themes, needs, frenchLevel, etc.), **Then** system executes MongoDB aggregation and stores result in cache with 5-15 minute TTL
2. **Given** result is cached for the same filter combination, **When** client calls GET /api/search/counts with identical filters within TTL, **Then** system returns cached result in under 100ms without executing MongoDB aggregation
3. **Given** cache TTL has expired, **When** client calls GET /api/search/counts with previously cached filters, **Then** system executes MongoDB aggregation again and updates cache

---

### User Story 2 - Invalidate Cache on Data Changes (Priority: P2)

As a system administrator, I want the cache to be automatically invalidated when dispositif data changes so that users always see current counts without stale data.

**Why this priority**: Ensures data consistency. Without cache invalidation, users could see outdated counts. This is critical for data integrity but depends on Story 1 being implemented first.

**Independent Test**: Can be fully tested by creating/updating/deleting a dispositif, then verifying the cache is cleared and next query returns fresh data from MongoDB. Delivers data consistency guarantee.

**Acceptance Scenarios**:

1. **Given** search counts are cached, **When** a dispositif status changes to CREATED or PUBLISHED, **Then** only cache entries for filter combinations matching this dispositif's attributes are invalidated
2. **Given** search counts are cached, **When** a dispositif status changes to DELETED or ARCHIVED, **Then** only cache entries for filter combinations matching this dispositif's attributes are invalidated (removed from search results)
3. **Given** cache is invalidated for specific filters, **When** client calls GET /api/search/counts with those filters, **Then** system executes fresh MongoDB aggregation while other cached entries remain valid

---

### User Story 3 - Tiered Caching with Graceful Degradation (Priority: P3)

As an operations team member, I want the system to implement tiered caching (Redis + per-container in-memory) so that service remains performant even if Redis becomes unavailable, and to provide visibility into cache performance.

**Why this priority**: Ensures reliability and observability at production scale. If Redis becomes unavailable, falling back to direct MongoDB queries would recreate the original database load problem. A per-container in-memory cache provides local resilience while Redis is being restored. This prevents cascading failures but is less critical than basic Redis caching.

**Independent Test**: Can be fully tested by simulating Redis unavailability and verifying API continues to return cached results from in-memory cache within acceptable latency. Delivers operational resilience without database overload.

**Acceptance Scenarios**:

1. **Given** Redis is unavailable but in-memory cache has valid entries, **When** client calls GET /api/search/counts, **Then** system returns result from per-container in-memory cache without querying MongoDB
2. **Given** both Redis and in-memory cache are unavailable, **When** client calls GET /api/search/counts, **Then** system executes MongoDB aggregation, stores in in-memory cache, and returns result
3. **Given** cache operations are occurring, **When** monitoring system queries cache metrics, **Then** it receives hit/miss ratio by cache layer (Redis vs in-memory), operation latency, and connection status for each layer

---

### User Story 4 - Debouncing and Rate Limiting (Priority: P2)

As a frontend developer, I want the search counts API to implement debouncing and rate limiting so that rapid successive queries (e.g., typing in search box) don't overwhelm the cache or backend with redundant requests.

**Why this priority**: Prevents cache thrashing from high-frequency requests. When users type character-by-character in the search box, each keystroke triggers a new query with a different search term, creating many unique cache keys. Rate limiting reduces unnecessary load and improves user experience by preventing API throttling.

**Independent Test**: Can be fully tested by simulating rapid API calls (e.g., 10 requests in 1 second) and verifying that only a subset are processed while others are rate-limited. Delivers protection against request storms.

**Acceptance Scenarios**:

1. **Given** client sends 10 requests within 1 second with different search terms, **When** rate limiter is configured to 2 requests/second, **Then** first 2 requests are processed, remaining 8 are rejected with 429 Too Many Requests
2. **Given** client sends requests with same search term within debounce window (e.g., 300ms), **When** frontend implements debouncing, **Then** only the final request after debounce delay is sent to API
3. **Given** rate limit is exceeded, **When** client retries after rate limit window expires, **Then** request is processed normally

---

### Edge Cases

- What happens when multiple filter combinations exist? System MUST generate unique cache keys for each combination and maintain them in both Redis and in-memory cache
- How does system handle cache stampede when many requests arrive simultaneously after cache expiration? System SHOULD use cache lock or probabilistic early expiration to prevent thundering herd
- What happens when Redis memory is full? System MUST handle eviction gracefully and rely on in-memory cache as fallback
- What happens when Redis is unavailable but in-memory cache is full? System MUST evict oldest entries and continue serving from remaining cache
- How does system determine which cache entries are affected by a dispositif change? System MUST track dispositif attributes (theme, needs, language, status, etc.) and invalidate only cache keys that would include this dispositif
- What happens when a dispositif's attributes change (e.g., theme reassignment)? System MUST invalidate cache for both old and new attribute combinations
- What happens when cache contains stale data due to network partition? System SHOULD prioritize availability over consistency with documented TTL window
- How are in-memory caches synchronized across multiple containers? Each container maintains its own independent in-memory cache; invalidation events must be broadcast to all containers
- What is the memory footprint of in-memory cache per container? System SHOULD limit in-memory cache size to prevent memory exhaustion (e.g., max 100MB per container)

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST cache search counts results using Redis with configurable TTL (default 5-15 minutes)
- **FR-002**: System MUST generate unique cache keys based on query parameters (themes, needs, frenchLevel, ageRanges, publics, languages, statuses, search)
- **FR-003**: System MUST implement selective cache invalidation: when dispositif status changes (CREATED, PUBLISHED, DELETED, ARCHIVED), only invalidate cache entries for filter combinations affected by this dispositif's attributes (theme, needs, language, status, etc.)
- **FR-004**: System MUST implement tiered caching: primary (Redis), secondary (per-container in-memory)
- **FR-005**: System MUST fall back to in-memory cache if Redis is unavailable
- **FR-006**: System MUST fall back to MongoDB aggregation only if both Redis and in-memory cache are unavailable
- **FR-007**: System MUST maintain separate TTL for in-memory cache (shorter than Redis, e.g., 1-5 minutes) to prevent stale data
- **FR-008**: System MUST return identical results whether data comes from Redis, in-memory cache, or direct aggregation
- **FR-009**: System MUST support manual cache clearing via admin endpoint that clears both Redis and all in-memory caches
- **FR-010**: System MUST log all cache operations (hits, misses, errors) with cache layer identification (Redis vs in-memory)
- **FR-011**: System MUST track and expose cache performance metrics separately for each cache layer (hit rate, miss rate, operation latency)
- **FR-012**: System MUST use VPC-secured Redis connection with TLS encryption in production
- **FR-013**: System MUST handle Redis connection failures without blocking API responses and transparently fall back to in-memory cache
- **FR-014**: System MUST implement rate limiting on the API endpoint with configurable requests per second (default 10 req/sec per IP)
- **FR-015**: System MUST return 429 Too Many Requests status code when rate limit is exceeded
- **FR-016**: System MUST include rate limit headers in responses (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- **FR-017**: Frontend MUST implement client-side debouncing for search input (default 300-500ms debounce delay)
- **FR-018**: System MUST document recommended debounce delay for API consumers to prevent cache thrashing

### Key Entities

- **Cache Entry**: Represents a cached search counts result with key (filter combination), value (SearchCountsResponse), TTL, and timestamp
- **Search Counts Query**: Represents a request to GET /api/search/counts with optional filters (themes, needs, frenchLevel, ageRanges, publics, languages, statuses, search)
- **SearchCountsResponse**: Object containing counts for themes, needs, frenchLevels, ageRanges, publics, languages, statuses, types (dispositif/demarche/online), and total
- **Redis Instance**: Managed service providing distributed cache storage with persistence and high availability (primary cache layer)
- **In-Memory Cache**: Per-container local cache using node-cache or similar (secondary cache layer for resilience)
- **Cache Invalidation Event**: Triggered when dispositif data changes, contains affected filter combinations to clear from both cache layers

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Cached search counts API responses complete in under 100ms (compared to current 500ms+ for uncached queries)
- **SC-002**: Cache hit rate exceeds 80% in production during normal usage patterns (combined Redis + in-memory)
- **SC-003**: Zero breaking changes to API contract - all existing clients continue working without modification
- **SC-004**: If Redis becomes unavailable, in-memory cache maintains performance within 150ms for cached entries
- **SC-005**: If both Redis and in-memory cache are unavailable, system falls back to MongoDB without cascading failures
- **SC-006**: Database query load for search counts endpoint reduced by at least 70% during normal operations (measured by MongoDB query count)
- **SC-007**: During Redis outage, database load remains within acceptable limits due to in-memory cache fallback
- **SC-008**: Selective cache invalidation occurs within 100ms of dispositif status change, invalidating only affected filter combinations across both cache layers
- **SC-009**: Unaffected cache entries remain valid and serve from cache, reducing unnecessary invalidations by at least 80% compared to aggressive clearing
- **SC-010**: Monitoring dashboard shows cache metrics separately for Redis and in-memory layers with at least 95% uptime
- **SC-011**: All cache operations include appropriate logging with cache layer identification for troubleshooting and auditing
- **SC-012**: Rate limiting reduces redundant API calls by at least 50% during typical search input scenarios (measured by comparing requests with/without debouncing)
- **SC-013**: Client-side debouncing prevents cache thrashing by reducing unique cache keys generated during search input by at least 60%
- **SC-014**: Rate-limited requests return 429 status with appropriate X-RateLimit headers within 10ms
- **SC-015**: Rate limiting does not affect legitimate batch operations or admin queries (configurable per-IP or per-user allowances)

## Assumptions

- Redis will be deployed on Google Cloud Memorystore in the same region as Cloud Run
- Existing GCP infrastructure and credentials can be reused
- Cache TTL of 5-15 minutes is acceptable for search counts data freshness
- Admin users can tolerate occasional stale data during network partitions
- MongoDB will remain the source of truth for all counts

## Clarifications Needed

### Session 2025-10-23

- Q: Rate limit scope - per-IP vs per-user? → A: **Per-IP only** (Option A). Rationale: Few authenticated users in current deployment; per-IP approach simpler to implement and maintain.

### Question 1: Cache Invalidation Strategy

**Context**: Edge case in specification addresses cache invalidation when dispositif data changes

**Decision**: Option B - Selective cache invalidation

**Implementation Approach**: When a dispositif status changes (CREATED, PUBLISHED, DELETED, ARCHIVED), the system will:

1. Extract the dispositif's attributes (theme, needs, language, status, type, etc.)
2. Determine which cache key combinations would be affected by this dispositif
3. Invalidate only those specific cache entries in both Redis and in-memory layers
4. Leave unaffected cache entries intact to maximize cache efficiency

**Benefits**:

- Better cache efficiency: 80%+ reduction in unnecessary invalidations
- Improved performance: More cache hits during high-frequency updates
- Scalability: Reduces load on cache layers during bulk operations

**Complexity**: Requires tracking dispositif attributes and building logic to determine affected filter combinations. This is addressed in FR-003 and edge case handling.

---

## Implementation Notes

**Rate Limiting Scope**: Rate limiting applies per-IP address only. All requests from the same IP are counted against the 10 req/sec limit, regardless of user identity. This approach is appropriate for the current deployment with few authenticated users and simplifies implementation.
