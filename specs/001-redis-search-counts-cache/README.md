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

**Tiered Caching Architecture** using Google Cloud Memorystore (Redis):

1. **Primary Cache**: Redis (5-15 min TTL) - shared across containers
2. **Secondary Cache**: Per-container in-memory (1-5 min TTL) - resilience during Redis outages
3. **Rate Limiting**: 10 req/sec per IP - prevents cache thrashing
4. **Client Debouncing**: 300-500ms delay - reduces redundant requests by 50%+
5. **Selective Invalidation**: Only clear affected cache entries on dispositif changes

---

## Constitutional Alignment

This feature respects the project's core principles:

✅ **Accessibility First**: Graceful degradation, configurable rate limits for batch operations, audit logging  
✅ **Multilingual by Design**: Language parameter included in cache keys  
✅ **Progressive Migration**: Leverages existing GCP infrastructure  
✅ **Monorepo Consistency**: Follows Turborepo conventions, pnpm package management  
✅ **Government Standards**: Rate limiting, audit trails, data integrity

---

## Key Decisions

### 1. Cache Invalidation Strategy: **Option B (Selective)**
- Track dispositif attributes (theme, needs, language, status, type)
- Only invalidate cache entries for affected filter combinations
- **Expected benefit**: 80%+ reduction in unnecessary invalidations
- **Applies to**: CREATED, PUBLISHED, DELETED, ARCHIVED status changes

### 2. Tiered Caching Approach
- Redis for distributed caching across containers
- Per-container in-memory cache prevents database overload during Redis outages
- **Rationale**: Production-scale resilience without recreating original performance problem

### 3. Rate Limiting & Debouncing
- API-level rate limiting (10 req/sec per IP, configurable)
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

## User Stories (4 Total)

### P1: Cache Search Counts Results
Core caching functionality with Redis (5-15 min TTL)

### P2: Invalidate Cache on Data Changes
Selective cache invalidation based on dispositif attributes

### P2: Debouncing and Rate Limiting
Client-side debouncing + API rate limiting to prevent cache thrashing

### P3: Tiered Caching with Graceful Degradation
In-memory fallback + monitoring for production resilience

---

## Implementation Scope

**18 Functional Requirements** covering:
- Redis caching with configurable TTL
- Selective cache invalidation
- Tiered caching (Redis + in-memory)
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

- **spec.md** - Complete feature specification with 4 user stories, 18 requirements, 14 success criteria
- **checklists/requirements.md** - Quality checklist (all items complete)
- **README.md** - This file

---

## Questions?

Refer to the [Linear ticket RI-914](https://linear.app/refugiesinfo/issue/RI-914/implement-redis-caching-for-search-counts-api) for discussion and updates.
