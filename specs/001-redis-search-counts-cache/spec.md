# Feature Specification: Redis Caching for Search Counts API

**Feature Branch**: `001-redis-search-counts-cache`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "Implement Redis caching for search counts API using Google Cloud Memorystore to improve performance. The GET /api/search/counts endpoint (Next.js route in client app) currently performs direct MongoDB aggregations on every request without caching, causing high database load and slow response times."

## User Scenarios & Testing *(mandatory)*

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

1. **Given** search counts are cached, **When** a dispositif status changes to DELETED or ARCHIVED, **Then** all related cache entries are invalidated
2. **Given** search counts are cached, **When** a new dispositif is created or published, **Then** cache entries for relevant filter combinations are invalidated
3. **Given** cache is invalidated, **When** client calls GET /api/search/counts with previously cached filters, **Then** system executes fresh MongoDB aggregation

---

### User Story 3 - Graceful Fallback and Monitoring (Priority: P3)

As an operations team member, I want the system to gracefully handle Redis failures and provide visibility into cache performance so that service remains available even if caching fails.

**Why this priority**: Ensures reliability and observability. If Redis becomes unavailable, the system should continue working by falling back to direct MongoDB queries. This prevents cascading failures but is less critical than basic caching.

**Independent Test**: Can be fully tested by simulating Redis unavailability and verifying API continues to work with direct MongoDB queries. Delivers operational resilience.

**Acceptance Scenarios**:

1. **Given** Redis is unavailable, **When** client calls GET /api/search/counts, **Then** system falls back to direct MongoDB aggregation and returns correct result
2. **Given** cache operations are occurring, **When** monitoring system queries cache metrics, **Then** it receives hit/miss ratio, operation latency, and connection status
3. **Given** Redis connection fails, **When** system attempts cache operations, **Then** error is logged and operation continues without blocking the API response

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- What happens when multiple filter combinations exist (type, publishedOnly, themeId)? System MUST generate unique cache keys for each combination
- How does system handle cache stampede when many requests arrive simultaneously after cache expiration? System SHOULD use cache lock or probabilistic early expiration to prevent thundering herd
- What happens when Redis memory is full? System MUST handle eviction gracefully and fall back to MongoDB
- How does system handle partial cache invalidation? When one dispositif changes, should all counts cache clear or only affected filters? NEEDS CLARIFICATION: Scope of invalidation (aggressive vs selective)
- What happens when cache contains stale data due to network partition? System SHOULD prioritize availability over consistency with documented TTL window

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST cache search counts results using Redis with configurable TTL (default 5-15 minutes)
- **FR-002**: System MUST generate unique cache keys based on query parameters (themes, needs, frenchLevel, ageRanges, publics, languages, statuses)
- **FR-003**: System MUST invalidate cache entries when dispositif status changes (CREATED, UPDATED, DELETED, ARCHIVED)
- **FR-004**: System MUST fall back to direct MongoDB aggregation if Redis is unavailable
- **FR-005**: System MUST return identical results whether data comes from cache or direct aggregation
- **FR-006**: System MUST support manual cache clearing via admin endpoint (POST /api/admin/cache/clear or similar)
- **FR-007**: System MUST log all cache operations (hits, misses, errors) with appropriate severity levels
- **FR-008**: System MUST track and expose cache performance metrics (hit rate, miss rate, operation latency)
- **FR-009**: System MUST use VPC-secured Redis connection with TLS encryption in production
- **FR-010**: System MUST handle Redis connection failures without blocking API responses

### Key Entities

- **Cache Entry**: Represents a cached search counts result with key (filter combination), value (SearchCountsResponse), TTL, and timestamp
- **Search Counts Query**: Represents a request to GET /api/search/counts with optional filters (themes, needs, frenchLevel, ageRanges, publics, languages, statuses, search)
- **SearchCountsResponse**: Object containing counts for themes, needs, frenchLevels, ageRanges, publics, languages, statuses, types (dispositif/demarche/online), and total
- **Redis Instance**: Managed service providing distributed cache storage with persistence and high availability
- **Cache Invalidation Event**: Triggered when dispositif data changes, contains affected filter combinations to clear

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: Cached search counts API responses complete in under 100ms (compared to current 500ms+ for uncached queries)
- **SC-002**: Cache hit rate exceeds 80% in production during normal usage patterns
- **SC-003**: Zero breaking changes to API contract - all existing clients continue working without modification
- **SC-004**: System gracefully falls back to MongoDB queries with no user-facing errors if Redis becomes unavailable
- **SC-005**: Database query load for search counts endpoint reduced by at least 70% (measured by MongoDB query count)
- **SC-006**: Cache invalidation occurs within 100ms of dispositif status change
- **SC-007**: Monitoring dashboard shows cache metrics with at least 95% uptime
- **SC-008**: All cache operations include appropriate logging for troubleshooting and auditing

## Assumptions

- Redis will be deployed on Google Cloud Memorystore in the same region as Cloud Run
- Existing GCP infrastructure and credentials can be reused
- Cache TTL of 5-15 minutes is acceptable for search counts data freshness
- Admin users can tolerate occasional stale data during network partitions
- MongoDB will remain the source of truth for all counts

## Clarifications Needed

### Question 1: Cache Invalidation Strategy

**Context**: Edge case in specification addresses cache invalidation when dispositif data changes

**What we need to know**: When a single dispositif is created, updated, deleted, or archived, should the system:

| Option | Answer | Implications |
|--------|--------|---------------|
| A | Clear ALL search counts cache entries regardless of filters | Simpler implementation, conservative approach, ensures no stale data, but may clear unrelated cache entries unnecessarily |
| B | Only clear cache entries for filter combinations that would be affected by this specific dispositif | More complex logic to determine affected filters, better cache efficiency, but requires tracking dispositif attributes |
| C | Hybrid approach: Start with aggressive (A), optimize to selective (B) in future iteration | Allows faster initial implementation, can be optimized later based on real-world usage patterns |
| Custom | Provide your own approach | Explain your preferred strategy |

**Your choice**: _[Awaiting user response]_
