# Phase 0: Research & Findings

**Feature**: Redis Caching for Search Counts API  
**Date**: 2025-10-23  
**Status**: Complete

---

## Research Area 1: Redis Connection Pooling

### Question
How should ioredis handle connection pooling with Google Cloud Memorystore?

### Decision
**Use ioredis with automatic connection pooling**

### Rationale
- ioredis provides built-in connection pooling with configurable pool size
- Google Cloud Memorystore supports standard Redis protocol
- No cluster mode required for single-instance Memorystore
- ioredis automatically handles reconnection and failover

### Implementation Details
```typescript
// Connection configuration for Google Cloud Memorystore
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: { rejectUnauthorized: false }, // For Cloud Memorystore
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});
```

### Alternatives Considered
- **Redis Cluster**: Not needed for single Memorystore instance; adds complexity
- **Connection pooling library (generic-pool)**: ioredis built-in pooling sufficient

### Success Criteria
- Connection established within 1 second
- Automatic reconnection on network failure
- No connection leaks under sustained load

---

## Research Area 2: Cache Invalidation in Client-Only Architecture

### Question
How does Next.js API route detect and respond to dispositif data changes?

### Decision
**Implement explicit cache invalidation via mutation event detection**

### Rationale
- Client-only architecture cannot automatically detect server-side mutations
- Explicit invalidation provides clear, testable behavior
- TTL expiration provides eventual consistency fallback
- Simpler than implementing cross-process communication

### Implementation Approach

#### Option A: Explicit Invalidation on Mutation (RECOMMENDED)
When dispositif is created/updated/deleted:
1. Mutation handler calls cache invalidation function
2. Function identifies affected cache keys
3. Invalidates keys in both Redis and in-memory cache
4. Returns success/failure status

**Pros**: Clear, testable, no external dependencies  
**Cons**: Requires mutation handler integration

#### Option B: Pub/Sub Subscription
Next.js API route subscribes to dispositif mutation events:
1. Redis pub/sub channel for cache invalidation events
2. API route listens for events
3. Invalidates cache on event receipt

**Pros**: Decoupled, scalable  
**Cons**: Requires event system, adds complexity

#### Option C: TTL-Only (Fallback)
No explicit invalidation; rely on TTL expiration:
1. All cache entries expire after 5-15 minutes
2. Stale data possible during TTL window
3. Simpler implementation

**Pros**: Simplest implementation  
**Cons**: Potential stale data, higher database load during TTL

### Recommended Implementation
**Hybrid approach**: Explicit invalidation (Option A) with TTL fallback (Option C)
- Primary: Explicit invalidation when mutations occur
- Fallback: TTL expiration ensures eventual consistency
- Best of both: Performance + consistency guarantee

### Success Criteria
- Cache invalidation occurs within 100ms of mutation
- Affected cache entries cleared from both layers
- Unaffected entries remain valid (80%+ efficiency)
- TTL provides 5-15 minute consistency window

---

## Research Area 3: Next.js Middleware Rate Limiting

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
| Redis Connection Pooling | ioredis with automatic pooling | ✅ Ready |
| Cache Invalidation | Explicit mutation + TTL fallback | ✅ Ready |
| Rate Limiting | Next.js middleware + Redis token bucket | ✅ Ready |
| In-Memory Cache | node-cache with LRU eviction | ✅ Ready |
| Monitoring | Prometheus metrics + structured logging | ✅ Ready |

---

## Next Steps

1. ✅ Phase 0: Research complete
2. ⏳ Phase 1: Generate data-model.md, contracts/, quickstart.md
3. ⏳ Phase 2: Run `/speckit.tasks` to generate tasks.md

**Status**: All research questions resolved. Ready for Phase 1 design.
