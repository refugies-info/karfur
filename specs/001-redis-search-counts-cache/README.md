# Redis Caching for Search Counts API - Feature Specification

**Linear Ticket**: [RI-914 - Implement Redis caching for search counts API](https://linear.app/refugiesinfo/issue/RI-914/implement-redis-caching-for-search-counts-api)  
**Status**: ✅ Specification Complete - Ready for Product Owner Review  
**Branch**: `001-redis-search-counts-cache`  
**Spec File**: `spec.md`

---

## Problem Statement

The GET `/api/search/counts` endpoint (Next.js API route in client app) performs direct MongoDB aggregations on every request without caching, causing:
- High database load during peak usage
- Slow response times (500ms+ vs target <100ms)
- Potential cascading failures under traffic spikes

**Production Testing Result**: Performance issues confirmed, caching solution required.

---

## Solution Overview

**Redis Caching Architecture** using Google Cloud Memorystore:

1. **Primary Cache**: Redis (5-15 min TTL) - shared across containers with high availability
2. **Rate Limiting**: Application-level rate limiting using @upstash/ratelimit with Redis backend (10 req/sec per IP) - prevents cache thrashing
3. **Client Debouncing**: 300-500ms delay - reduces redundant requests by 50%+
4. **Selective Invalidation**: Only clear affected cache entries on dispositif changes

---

## Constitutional Alignment

This feature respects the project's core principles:

✅ **Accessibility First**: Service remains available during Redis outages (graceful degradation to MongoDB), no breaking changes to API  
✅ **Multilingual by Design**: Language parameter included in cache keys, language-specific counts preserved  
✅ **Progressive Migration**: Leverages existing GCP infrastructure (Translation API, Indexing API already use Google Cloud)  
✅ **Monorepo Consistency**: Follows Turborepo conventions, pnpm package management, consistent logging patterns  
✅ **Government Standards**: Rate limiting prevents abuse, audit logging for all cache operations, data integrity maintained

---

## Key Decisions

### 1. Cache Invalidation Strategy: **Option B (Selective)**
- Track dispositif attributes (theme, needs, language, status, type)
- Only invalidate cache entries for affected filter combinations
- **Expected benefit**: 80%+ reduction in unnecessary invalidations
- **Applies to**: CREATED, PUBLISHED, DELETED, ARCHIVED status changes

### 2. Redis-Only Caching Approach
- Redis for distributed caching across containers with high availability
- Graceful fallback to MongoDB if Redis unavailable
- **Rationale**: Simplified architecture with HA Memorystore eliminates need for complex per-container caching

### 3. Rate Limiting & Debouncing
- API-level rate limiting (10 req/sec per IP, configurable) using @upstash/ratelimit with Redis backend
- Client-side debouncing (300-500ms default)
- **Rationale**: Prevents cache thrashing from rapid search input (character-by-character typing)

---

## Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response Time (Cached) | <100ms | API latency |
| Cache Hit Rate | >80% | Production metrics |
| Database Load Reduction | 70%+ | MongoDB query count |
| Invalidation Efficiency | 80%+ reduction | vs aggressive clearing |
| Rate Limit Effectiveness | 50%+ reduction | redundant API calls |
| Debouncing Effectiveness | 60%+ reduction | unique cache keys |

---

## User Stories (3 Total)

### P1: Cache Search Counts Results
Core caching functionality with Redis (5-15 min TTL)

### P2: Invalidate Cache on Data Changes
Selective cache invalidation based on dispositif attributes

### P2: Debouncing and Rate Limiting
Client-side debouncing + API rate limiting to prevent cache thrashing

---

## Implementation Scope

**18 Functional Requirements** covering:
- Redis caching with configurable TTL
- Selective cache invalidation
- Redis-only caching with graceful fallback
- Rate limiting and debouncing
- Monitoring, logging, and metrics
- VPC security and TLS encryption

**14 Success Criteria** with measurable outcomes

**8 Edge Cases** with clear handling strategies

---

## Next Steps

1. ✅ Specification complete and ready for review
2. 📋 Product owner review and approval
3. 🚀 Proceed with `/speckit.plan` for implementation planning
4. 📝 Generate tasks and design artifacts

---

## Files

- **spec.md** - Complete feature specification with 3 user stories, 18 requirements, 14 success criteria
- **checklists/requirements.md** - Quality checklist (all items complete)
- **README.md** - This file

---

## Questions?

Refer to the [Linear ticket RI-914](https://linear.app/refugiesinfo/issue/RI-914/implement-redis-caching-for-search-counts-api) for discussion and updates.
