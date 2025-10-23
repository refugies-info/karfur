# Phase 0: Research & Findings

**Feature**: Redis Caching for Search Counts API  
**Date**: 2025-10-23  
**Status**: Complete

---

## Research Area 1: Redis Resilience & High Availability

### Question
How to ensure Redis availability during Memorystore maintenance, upgrades, and failures?

### Concern
Single-instance Memorystore is vulnerable to:
- Unattended upgrades (Google Cloud maintenance windows)
- Hardware failures
- Network partitions
- Planned maintenance (0-30 min downtime)

During outage, all traffic falls back to in-memory cache, causing:
- Cache stampede (all instances miss simultaneously)
- Memory spikes (all instances populate in-memory cache)
- Potential OOM if dataset larger than per-instance memory limit

### Decision
**Use Memorystore High Availability (HA) with automatic failover + write-through in-memory cache**

### Rationale
- **Memorystore HA**: Provides automatic failover with <1s switchover time
- **Write-Through Cache**: Ensures in-memory cache stays warm during normal operation
- **Resilience**: Handles unattended upgrades without user-facing downtime
- **Performance**: In-memory cache serves requests during Redis failover

### Implementation Details

#### Option A: Memorystore HA (RECOMMENDED)
```typescript
// Google Cloud Memorystore HA provides:
// - Primary + replica instances
// - Automatic failover (<1s)
// - Transparent to application
// - Cost: ~2x single instance

const redis = new Redis({
  host: process.env.REDIS_HOST, // HA endpoint (handles failover)
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  sentinels: [], // Not needed with HA endpoint
});
```

#### Option B: Write-Through In-Memory Cache (REQUIRED)
Ensure in-memory cache stays synchronized with Redis:
```typescript
async function cacheGet(key: string): Promise<any> {
  // Try Redis first
  try {
    const value = await redis.get(key);
    if (value) {
      // Write-through: also populate in-memory cache
      memoryCache.set(key, JSON.parse(value));
      return JSON.parse(value);
    }
  } catch (error) {
    logger.warn({ key, error }, 'Redis get failed, falling back to memory');
  }
  
  // Fallback to in-memory cache
  const memValue = memoryCache.get(key);
  if (memValue) {
    return memValue;
  }
  
  return null;
}

async function cacheSet(key: string, value: any, ttl: number): Promise<void> {
  // Write-through: set in both layers
  memoryCache.set(key, value, ttl);
  
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.warn({ key, error }, 'Redis set failed, in-memory cache still valid');
  }
}
```

#### Option C: Connection Pooling with Sentinel (ALTERNATIVE)
Use Redis Sentinel for manual HA:
```typescript
const redis = new Redis({
  sentinels: [
    { host: process.env.SENTINEL_HOST_1, port: 26379 },
    { host: process.env.SENTINEL_HOST_2, port: 26379 },
    { host: process.env.SENTINEL_HOST_3, port: 26379 },
  ],
  name: 'mymaster',
  password: process.env.REDIS_PASSWORD,
  sentinelPassword: process.env.SENTINEL_PASSWORD,
});
```
**Cons**: Requires managing Sentinel infrastructure; Memorystore HA simpler

### Resilience Scenarios

| Scenario | With HA + Write-Through | Without HA |
|----------|------------------------|------------|
| **Memorystore upgrade** | <1s failover, in-memory cache serves | 30+ min downtime, cache stampede |
| **Hardware failure** | Automatic failover to replica | Full outage, memory spike |
| **Network partition** | Failover to replica | All traffic to in-memory cache |
| **Cache stampede risk** | Low (warm in-memory cache) | High (cold in-memory cache) |
| **Memory spike risk** | Low (gradual population) | High (simultaneous population) |

### Success Criteria
- Memorystore HA enabled with <1s failover
- Write-through cache keeps in-memory warm
- In-memory cache serves requests during Redis failover
- No cache stampede during maintenance windows
- Memory usage stays <100MB per instance
- Downtime <1s during failover

---

## Research Area 2: Multi-Instance Cache Architecture

### Question
How to handle cache invalidation and consistency across multiple Cloud Run instances?

### Concern
Per-instance in-memory cache creates synchronization challenges:
- **Invalidation Broadcast**: When one instance invalidates cache, others don't know
- **Stale Data**: Different instances serve different cached data
- **Complexity**: Requires pub/sub, event listeners, or cross-instance communication
- **Operational Burden**: Harder to debug, monitor, and maintain

### Decision
**Simplify to Redis-only (HA) with TTL expiration. Remove per-instance in-memory cache.**

### Rationale
- **Memorystore HA provides resilience**: <1s failover handles maintenance/failures
- **Eliminates synchronization problem**: Single source of truth (Redis)
- **Simpler architecture**: No cross-instance communication needed
- **Easier to operate**: Single cache layer to monitor and debug
- **Still resilient**: TTL expiration (5-15 min) provides eventual consistency

### Revised Architecture

#### Option A: Redis HA Only (RECOMMENDED)
```typescript
// Single cache layer: Redis HA
// - Memorystore HA handles failover automatically
// - All instances read/write to same Redis
// - TTL expiration ensures consistency
// - No cross-instance synchronization needed

const redis = new Redis({
  host: process.env.REDIS_HOST, // HA endpoint
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

async function cacheGet(key: string): Promise<any> {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.warn({ key, error }, 'Redis get failed');
    // Fall back to database query
    return null;
  }
}

async function cacheSet(key: string, value: any, ttl: number): Promise<void> {
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.warn({ key, error }, 'Redis set failed, query will be uncached');
    // Graceful degradation: continue without cache
  }
}
```

#### Option B: Redis HA + Local In-Memory Cache (COMPLEX)
Keep per-instance in-memory cache but requires:
1. Pub/sub subscription for invalidation events
2. Event listener in each instance
3. Cross-instance communication overhead
4. Harder to debug and monitor

**Cons**: Complexity not justified by performance gain  
**Pros**: Slightly faster reads during Redis latency

### Resilience with Redis HA Only

| Scenario | Behavior | Impact |
|----------|----------|--------|
| **Normal operation** | All instances hit Redis HA | <100ms response time |
| **Memorystore upgrade** | <1s failover to replica | <1s downtime |
| **Hardware failure** | Automatic failover | <1s downtime |
| **Redis unavailable** | Queries go to database | Slower but operational |
| **Cache invalidation** | Single operation in Redis | Instant across all instances |
| **Consistency** | Strong (all instances see same data) | No stale data issues |

### Success Criteria
- Redis HA endpoint configured with <1s failover
- Cache invalidation via explicit mutation handlers
- TTL expiration (5-15 min) ensures eventual consistency
- All instances read/write to same Redis
- No cross-instance communication needed
- Graceful degradation if Redis unavailable
- <100ms response time for cached requests

---

## Research Area 4: Next.js Middleware Rate Limiting

### Question
How to implement per-IP rate limiting in Next.js middleware on Cloud Run?

### Decision
**Use Next.js middleware with Redis-backed token bucket algorithm**

### Rationale
- Next.js middleware runs on every request before route handler
- Redis provides distributed state across Cloud Run instances
- Token bucket algorithm is industry-standard for rate limiting
- Handles `x-forwarded-for` header for Cloud Run IP detection

### Implementation Details

#### Getting Client IP in Cloud Run
```typescript
function getClientIp(request: NextRequest): string {
  // Cloud Run sets x-forwarded-for header
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.ip || 'unknown';
}
```

#### Token Bucket Algorithm
```typescript
// Redis key: rate_limit:{ip}
// Value: { tokens: number, lastRefill: timestamp }
// Default: 10 requests per second per IP

async function checkRateLimit(ip: string, limit: number = 10): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const now = Date.now();
  
  // Lua script for atomic operation
  const script = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local now = tonumber(ARGV[2])
    local window = 1000 -- 1 second
    
    local current = redis.call('GET', key)
    if not current then
      redis.call('SET', key, limit - 1)
      redis.call('EXPIRE', key, 1)
      return 1
    end
    
    local tokens = tonumber(current)
    if tokens > 0 then
      redis.call('DECR', key)
      return 1
    end
    return 0
  `;
  
  return await redis.eval(script, 1, key, limit, now);
}
```

#### Middleware Implementation
```typescript
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/search/counts')) {
    const ip = getClientIp(request);
    const allowed = await checkRateLimit(ip, 10);
    
    if (!allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(Date.now() + 1000).toISOString(),
        },
      });
    }
  }
}
```

### Alternatives Considered
- **In-memory rate limiting**: Not distributed; different limits per instance
- **Database-backed rate limiting**: Slower than Redis
- **Third-party service (e.g., Cloudflare)**: Adds external dependency

### Success Criteria
- Rate limit enforced per IP (10 req/sec default)
- Distributed across Cloud Run instances via Redis
- Response headers include X-RateLimit-* fields
- Legitimate batch operations can be exempted via configuration

---

## Research Area 4: In-Memory Cache Eviction Strategy

### Question
How to manage in-memory cache with node-cache in multi-instance Cloud Run?

### Decision
**Use node-cache with LRU eviction and per-instance independence**

### Rationale
- node-cache provides simple, fast in-memory caching
- LRU eviction strategy balances memory usage and hit rate
- Per-instance independence simplifies multi-instance deployment
- Redis provides distributed cache; in-memory is resilience layer

### Implementation Details

#### node-cache Configuration
```typescript
import NodeCache from 'node-cache';

const memoryCache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone values (performance)
  maxKeys: 10000, // Max 10k entries
});

// Monitor memory usage
memoryCache.on('set', (key, value) => {
  const memoryUsage = process.memoryUsage();
  if (memoryUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
    // Trigger eviction or warn
    console.warn('Memory usage high, consider eviction');
  }
});
```

#### Eviction Strategy
- **LRU (Least Recently Used)**: Built into node-cache via `checkperiod`
- **Memory Limit**: Monitor heap usage; clear cache if >100MB
- **TTL Expiration**: Automatic cleanup via `checkperiod`

#### Multi-Instance Behavior
- Each Cloud Run instance has independent in-memory cache
- No synchronization between instances needed
- Redis provides shared cache across instances
- During Redis outage, each instance serves from its own in-memory cache

### Alternatives Considered
- **Shared in-memory cache (e.g., Memcached)**: Adds external dependency
- **Database-backed cache**: Slower than in-memory
- **No in-memory cache**: Loses resilience during Redis outage

### Success Criteria
- In-memory cache latency <10ms
- Memory footprint <100MB per instance
- LRU eviction prevents memory exhaustion
- Independent per-instance operation

---

## Research Area 5: Monitoring & Observability

### Question
How to monitor cache performance and operational health?

### Decision
**Implement Prometheus metrics with structured logging**

### Rationale
- Prometheus is industry-standard for metrics
- Structured logging enables debugging and auditing
- Metrics provide visibility into cache effectiveness
- Aligns with existing monitoring infrastructure

### Implementation Details

#### Prometheus Metrics
```typescript
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Cache hit/miss counters
const cacheHits = new Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['layer'], // 'redis' or 'memory'
});

const cacheMisses = new Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['layer'],
});

// Cache operation latency
const cacheLatency = new Histogram({
  name: 'cache_operation_duration_ms',
  help: 'Cache operation latency in milliseconds',
  labelNames: ['operation', 'layer'], // operation: 'get', 'set', 'invalidate'
  buckets: [1, 5, 10, 25, 50, 100, 250, 500],
});

// Redis connection status
const redisConnected = new Gauge({
  name: 'redis_connected',
  help: 'Redis connection status (1=connected, 0=disconnected)',
});

// Cache size
const cacheSize = new Gauge({
  name: 'cache_size_bytes',
  help: 'Cache size in bytes',
  labelNames: ['layer'],
});
```

#### Structured Logging
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-stackdriver', // For Google Cloud Logging
  },
});

// Log cache operations
logger.info({
  operation: 'cache_get',
  layer: 'redis',
  key: cacheKey,
  hit: true,
  latency_ms: 5,
  timestamp: new Date().toISOString(),
});
```

#### Monitoring Dashboard
- Cache hit rate (%) by layer
- Cache operation latency (p50, p95, p99)
- Redis connection status
- In-memory cache size and eviction rate
- Rate limit violations per IP
- Database query count (before/after caching)

### Success Criteria
- Metrics exposed on `/metrics` endpoint
- Cache hit rate >80% visible in dashboard
- Latency <100ms for cached requests
- Redis connection status monitored
- Audit trail of cache operations

---

## Summary of Findings

| Research Area | Decision | Status |
|---------------|----------|--------|
| **Redis Resilience & HA** | Memorystore HA (single source of truth) | ✅ Ready |
| **Multi-Instance Architecture** | Redis-only (eliminates sync complexity) | ✅ Ready |
| Cache Invalidation | Explicit mutation + TTL fallback | ✅ Ready |
| Rate Limiting | Next.js middleware + Redis token bucket | ✅ Ready |
| Monitoring | Prometheus metrics + structured logging | ✅ Ready |

### Key Architectural Decision
**Redis HA Only (Simplified)**: Single cache layer with Memorystore HA provides:
- **Resilience**: <1s failover handles maintenance/failures
- **Simplicity**: No cross-instance communication needed
- **Consistency**: All instances read/write to same Redis
- **Operability**: Single cache layer to monitor and debug
- **Graceful Degradation**: Falls back to database if Redis unavailable

**Removed**: Per-instance in-memory cache (complexity not justified)

---

## Next Steps

1. ✅ Phase 0: Research complete
2. ⏳ Phase 1: Generate data-model.md, contracts/, quickstart.md
3. ⏳ Phase 2: Run `/speckit.tasks` to generate tasks.md

**Status**: All research questions resolved. Ready for Phase 1 design.

---

## Implementation Priority

1. **CRITICAL**: Memorystore HA configuration (single source of truth, <1s failover)
2. **CRITICAL**: Cache invalidation logic (explicit mutation handlers)
3. **HIGH**: Rate limiting middleware (per-IP, Redis-backed)
4. **HIGH**: TTL expiration (5-15 min eventual consistency)
5. **MEDIUM**: Monitoring & observability (Prometheus metrics)

### Architecture Simplification Benefits
- ✅ Eliminated per-instance in-memory cache complexity
- ✅ No cross-instance pub/sub or event listeners needed
- ✅ Single source of truth (Redis HA)
- ✅ Instant cache invalidation across all instances
- ✅ Easier to debug and operate
- ✅ Memorystore HA provides resilience without application complexity
