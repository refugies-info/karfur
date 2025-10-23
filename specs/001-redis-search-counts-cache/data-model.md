# Phase 1: Data Model & Contracts

**Feature**: Redis Caching for Search Counts API  
**Date**: 2025-10-23  
**Status**: Complete

---

## Data Model

### Cache Entry Schema

**Redis Key Format**:
```
cache:search_counts:{language}:{filters_hash}
```

**Example**:
```
cache:search_counts:fr:abc123def456
cache:search_counts:en:xyz789uvw012
```

**Redis Value (JSON)**:
```json
{
  "version": 1,
  "timestamp": "2025-10-23T12:00:00Z",
  "ttl": 600,
  "data": {
    "total": 1250,
    "themes": {
      "63286a015d31b2c0cad9960f": 450,
      "63286a015d31b2c0cad9960a": 380,
      "63286a015d31b2c0cad9960c": 420
    },
    "needs": {
      "613721a409c5190dfa70d053": 320,
      "613721a409c5190dfa70d052": 280,
      "614d9a3e95b9b700142ef6c4": 650
    },
    "frenchLevels": {
      "A1": 200,
      "A2": 350,
      "B1": 400,
      "B2": 300
    },
    "ageRanges": {
      "-18": 150,
      "18-25": 400,
      "+25": 700
    },
    "publics": {
      "family": 300,
      "women": 250,
      "youths": 200
    },
    "languages": {
      "fr": 800,
      "en": 200,
      "ar": 150
    },
    "statuses": {
      "asile": 400,
      "refugie": 500,
      "subsidiaire": 200
    },
    "types": {
      "dispositif": 900,
      "demarche": 250,
      "online": 100
    }
  }
}
```

### Cache Key Components

**Language**: ISO 639-1 code (e.g., `fr`, `en`, `ar`)

**Filters Hash**: SHA-256 hash of filter parameters
```typescript
// Example filter object
{
  themes: ['health', 'education'],
  needs: ['legal', 'financial'],
  frenchLevel: ['A1', 'A2'],
  status: ['PUBLISHED'],
  type: ['ASSOCIATION'],
  search: 'paris'
}

// Hash: SHA-256(JSON.stringify(sortedFilters))
// Result: abc123def456...
```

### Cache Invalidation Events

**Event Structure** (logged to Cloud Logging):
```json
{
  "operation": "cache_invalidate",
  "trigger": "dispositif_updated",
  "dispositif_id": "507f1f77bcf86cd799439011",
  "dispositif_attributes": {
    "themes": ["health"],
    "needs": ["legal"],
    "frenchLevel": ["A1", "A2"],
    "status": "PUBLISHED",
    "type": "ASSOCIATION"
  },
  "affected_cache_keys": [
    "cache:search_counts:fr:abc123",
    "cache:search_counts:en:xyz789"
  ],
  "keys_invalidated": 2,
  "latency_ms": 5,
  "timestamp": "2025-10-23T12:00:00Z"
}
```

### Rate Limiting State

**Cloud Load Balancer Rate Limiting** (managed by Google Cloud):
- Per-IP tracking (infrastructure-level)
- 10 requests per second (configurable)
- 60-second ban duration on exceed
- Returns 429 Too Many Requests

**No application state needed** - handled by Cloud Armor

### Application Logging Schema

**Cache Operation Log**:
```json
{
  "operation": "cache_get",
  "key": "cache:search_counts:fr:abc123",
  "hit": true,
  "latency_ms": 3,
  "timestamp": "2025-10-23T12:00:00Z"
}
```

**API Response Log**:
```json
{
  "operation": "api_response",
  "endpoint": "/api/search/counts",
  "method": "GET",
  "status": 200,
  "cache_hit": true,
  "database_queries": 0,
  "latency_ms": 45,
  "language": "fr",
  "filters_hash": "abc123",
  "timestamp": "2025-10-23T12:00:00Z"
}
```

**Cache Invalidation Log**:
```json
{
  "operation": "cache_invalidate",
  "trigger": "dispositif_created",
  "dispositif_id": "507f1f77bcf86cd799439011",
  "keys_invalidated": 3,
  "latency_ms": 2,
  "timestamp": "2025-10-23T12:00:00Z"
}
```

---

## Database Schema

### MongoDB Collections

**Existing `dispositifs` collection** (no changes):
```javascript
{
  _id: ObjectId,
  name: String,
  themes: [String],
  needs: [String],
  frenchLevel: [String],
  status: String,  // CREATED, PUBLISHED, DELETED, ARCHIVED
  type: String,    // ASSOCIATION, SERVICE, etc.
  // ... other fields
}
```

**No new collections needed** - cache is ephemeral (Redis only)

---

## API Contracts

### GET /api/search/counts

**Request**:
```
GET /api/search/counts?language=fr&themes=health,education&needs=legal&frenchLevel=A1,A2&status=PUBLISHED
```

**Query Parameters**:
- `language` (required): ISO 639-1 code (fr, en, ar, etc.)
- `themes` (optional): Comma-separated theme IDs
- `needs` (optional): Comma-separated need IDs
- `frenchLevel` (optional): Comma-separated levels (A1, A2, B1, B2, B1+, B2+)
- `status` (optional): Comma-separated statuses (CREATED, PUBLISHED, DELETED, ARCHIVED)
- `type` (optional): Comma-separated types (ASSOCIATION, SERVICE, etc.)
- `search` (optional): Free-text search query

**Response** (200 OK):
```json
{
  "total": 1250,
  "byTheme": {
    "health": 450,
    "education": 380,
    "housing": 420
  },
  "byNeeds": {
    "legal": 320,
    "financial": 280,
    "medical": 650
  },
  "byFrenchLevel": {
    "A1": 200,
    "A2": 350,
    "B1": 400,
    "B2": 300
  },
  "cached": true,
  "cacheAge": 120
}
```

**Response Headers**:
```
X-Cache-Hit: true
X-Cache-Age: 120
X-Cache-TTL: 600
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 2025-10-23T12:00:01Z
```

**Error Responses**:

429 Too Many Requests (rate limited):
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded: 10 requests per second per IP",
  "retryAfter": 60
}
```

400 Bad Request (invalid parameters):
```json
{
  "error": "Bad Request",
  "message": "Invalid language: 'xx'. Supported: fr, en, ar, etc."
}
```

500 Internal Server Error:
```json
{
  "error": "Internal Server Error",
  "message": "Failed to fetch search counts"
}
```

---

## Cache Invalidation Triggers

### Dispositif Mutations

**On CREATE**:
- Invalidate all cache keys matching dispositif attributes
- Log: `trigger: "dispositif_created"`

**On UPDATE**:
- Invalidate all cache keys matching old attributes
- Invalidate all cache keys matching new attributes
- Log: `trigger: "dispositif_updated"`

**On DELETE**:
- Invalidate all cache keys matching dispositif attributes
- Log: `trigger: "dispositif_deleted"`

**On STATUS CHANGE** (CREATED → PUBLISHED → ARCHIVED → DELETED):
- Invalidate all cache keys matching dispositif attributes
- Log: `trigger: "dispositif_status_changed"`

### Invalidation Algorithm

```typescript
function getAffectedCacheKeys(dispositif: Dispositif): string[] {
  const affectedKeys: string[] = [];
  
  // For each language
  for (const language of SUPPORTED_LANGUAGES) {
    // Generate all possible filter combinations that include this dispositif
    // This is a simplified version - actual implementation would be more complex
    
    // Invalidate keys where:
    // - themes includes dispositif.themes
    // - needs includes dispositif.needs
    // - frenchLevel includes dispositif.frenchLevel
    // - status includes dispositif.status
    // - type includes dispositif.type
    
    const key = `cache:search_counts:${language}:*`;
    affectedKeys.push(key);
  }
  
  return affectedKeys;
}
```

---

## TTL Strategy

**Cache TTL**: 5-15 minutes (configurable)
- Default: 10 minutes (600 seconds)
- Minimum: 5 minutes (300 seconds)
- Maximum: 15 minutes (900 seconds)

**Rationale**:
- Balances freshness vs. database load
- Handles unattended upgrades (Memorystore maintenance)
- Provides eventual consistency guarantee
- Acceptable staleness for search counts

**Configuration**:
```typescript
const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || '600');
```

---

## Performance Targets

**Cached Response**:
- Latency: <100ms (p99)
- Source: Redis (Memorystore HA)

**Uncached Response**:
- Latency: 200-500ms (p99)
- Source: MongoDB aggregation

**Cache Hit Rate Target**: >80%

**Database Load Reduction**: 70%+ (fewer queries due to caching)

---

## Monitoring Metrics

### Memorystore Metrics (Automatic)
- Redis memory usage
- Connected clients
- Commands per second
- Eviction rate
- Replication lag (HA)
- Network I/O
- CPU usage

### Application Metrics (Cloud Logging)
- Cache hit rate (%)
- Cache operation latency (p50, p95, p99)
- API response time
- Database query count
- Rate limit violations
- Cache invalidation events

### Success Criteria
- Cache hit rate >80%
- Cached response latency <100ms
- Database load reduced by 70%+
- Memorystore HA failover <1s
- No cache stampede during failover
- Invalidation latency <100ms

---

## Deployment Checklist

- [ ] Memorystore HA instance created
- [ ] Cloud Load Balancer configured
- [ ] Cloud Armor rate limiting policy attached
- [ ] Next.js API route implemented
- [ ] Cache layer (redis.ts) implemented
- [ ] Cache invalidation logic implemented
- [ ] Structured logging configured
- [ ] Cloud Monitoring dashboard created
- [ ] Cloud Logging queries configured
- [ ] Alerts configured
- [ ] Load testing completed
- [ ] Production deployment

---

## Next Steps

1. ✅ Phase 1: Data model complete
2. ⏳ Generate contracts/ (OpenAPI spec)
3. ⏳ Generate quickstart.md
4. ⏳ Phase 2: Run `/speckit.tasks` to generate tasks.md

**Status**: Ready for contracts and quickstart generation.
