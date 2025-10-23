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

## Research Area 4: Rate Limiting Strategy

### Question
How to implement per-IP rate limiting (10 req/sec default)?

### Decision
**Use Cloud Load Balancer-based rate limiting (RECOMMENDED) with optional application-level fallback**

### Rationale
- **Cloud Load Balancer**: Managed service, no code to maintain
- **Infrastructure-level**: Blocks traffic before reaching Cloud Run
- **Cost-effective**: Prevents unnecessary compute usage
- **Simpler**: No Redis dependency for rate limiting
- **Reliable**: Google-managed, high availability
- **Fallback**: Application-level rate limiting if needed for specific endpoints

### Implementation Options

#### Option A: Cloud Load Balancer Rate Limiting (RECOMMENDED)
```yaml
# Google Cloud Load Balancer configuration
# Terraform/Deployment Manager

resource "google_compute_security_policy" "rate_limit_policy" {
  name = "search-counts-rate-limit"
  
  # Rate limiting rule: 10 requests per second per IP
  rule {
    action   = "rate-based-ban"
    priority = "1000"
    match {
      versioned_expr = "CEL"
      expr           = "origin.region_code == 'US' || origin.region_code == 'FR'"
    }
    rate_limit_options {
      conform_action   = "allow"
      exceed_action    = "deny-429"
      rate_limit_threshold {
        count        = 10
        interval_sec = 1
      }
      ban_duration_sec = 60
    }
  }
  
  # Default rule: allow
  rule {
    action   = "allow"
    priority = "65535"
    match {
      versioned_expr = "CEL"
      expr           = "true"
    }
  }
}

# Attach to backend service
resource "google_compute_backend_service" "search_counts" {
  name            = "search-counts-backend"
  security_policy = google_compute_security_policy.rate_limit_policy.id
  # ... other config
}
```

**Pros**:
- No application code needed
- Blocks traffic at infrastructure level
- Prevents DDoS and abuse before reaching compute
- Managed by Google Cloud
- Returns 429 status automatically
- Per-IP tracking built-in

**Cons**:
- Requires Cloud Load Balancer (not available with Cloud Run direct URLs)
- Additional infrastructure cost
- Less flexible for complex rate limiting rules

#### Option B: Cloud Armor Rate Limiting (ALTERNATIVE)
Google Cloud Armor provides advanced rate limiting:
```yaml
# Cloud Armor security policy
rule {
  action = "rate-based-ban"
  priority = 1000
  match {
    expr {
      expression = "evaluatePreconfiguredExpr('xss-v33-stable')"
    }
  }
  rate_limit_options {
    conform_action = "allow"
    exceed_action = "deny-429"
    rate_limit_threshold {
      count = 10
      interval_sec = 1
    }
    ban_duration_sec = 60
    # Optional: enforce on key
    enforce_on_key = "IP"
  }
}
```

**Pros**: Advanced DDoS protection, adaptive rate limiting  
**Cons**: Higher cost, more complex configuration

#### Option C: Application-Level Rate Limiting (FALLBACK)
If load balancer rate limiting unavailable, implement in Next.js middleware:
```typescript
// Use only if Cloud Load Balancer not available
// Redis-backed token bucket for distributed rate limiting

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.ip || 'unknown';
}

async function checkRateLimit(ip: string, limit: number = 10): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const now = Date.now();
  
  const script = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local now = tonumber(ARGV[2])
    local window = 1000
    
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

**Pros**: Flexible, no infrastructure changes  
**Cons**: Requires Redis, adds application complexity, uses compute resources

### Comparison

| Aspect | Cloud LB | Cloud Armor | App-Level |
|--------|----------|-------------|----------|
| **Setup** | Infrastructure config | Infrastructure config | Code |
| **Cost** | Moderate | Higher | Lower (uses compute) |
| **Complexity** | Low | Medium | High |
| **Flexibility** | Limited | Good | High |
| **DDoS Protection** | Basic | Advanced | None |
| **Maintenance** | Minimal | Minimal | Ongoing |
| **Latency** | <1ms | <1ms | 5-10ms |

### Success Criteria
- Rate limiting enforced at 10 req/sec per IP (via Cloud Armor)
- 429 status returned when exceeded
- X-RateLimit-* headers in response (optional, Cloud Armor provides basic headers)
- Transparent to application (handled at load balancer level)
- No impact on cached request latency
- Traffic blocked before reaching Cloud Run instances

### Cloud Run Native Rate Limiting

**Important Note**: Google Cloud Run does NOT offer native rate limiting at the service level.

Cloud Run provides:
- **Concurrency limits**: Max concurrent requests per instance (default 80)
- **Request timeout**: Max request duration (default 60s)
- **Memory/CPU limits**: Per-instance resource constraints
- **Automatic scaling**: Scales based on traffic

**What Cloud Run does NOT provide**:
- ❌ Per-IP rate limiting
- ❌ Request throttling
- ❌ Rate-based traffic shaping
- ❌ 429 Too Many Requests responses

### Recommended Approach

**Primary**: Use Cloud Load Balancer with Cloud Armor rate limiting  
**Alternative**: Application-level rate limiting if load balancer unavailable

This provides:
- Infrastructure-level protection (blocks before compute)
- No application code complexity
- Cost-effective (prevents unnecessary compute usage)
- Managed by Google Cloud

### Architecture Decision

For this feature:
1. **Deploy with Cloud Load Balancer** in front of Cloud Run
2. **Attach Cloud Armor security policy** with rate limiting (10 req/sec per IP)
3. **Configure to return 429** when rate limit exceeded
4. **Monitor**: Track rate limit violations via Cloud Logging

**Why not Cloud Run alone?**
- Cloud Run has no native rate limiting
- Load Balancer provides infrastructure-level protection
- Blocks malicious traffic before reaching compute
- More cost-effective than application-level handling

**If Load Balancer not available**:
- Fall back to application-level rate limiting
- Use Redis-backed token bucket in Next.js middleware
- Less efficient but still functional

---

## Research Area 5: Monitoring & Observability

### Question
How to monitor cache performance and operational health?

### Decision
**Use Google Memorystore built-in metrics + Cloud Logging for application logs**

### Rationale
- **Google Memorystore automatically exports metrics** to Cloud Monitoring
- No application instrumentation needed for Redis metrics
- Cloud Monitoring provides dashboards and alerting
- Application logs via Cloud Logging (structured JSON)
- Minimal overhead - leverage managed services

### What Memorystore Provides

**Automatic metrics (no code needed)**:
- Redis memory usage (bytes, percentage)
- Connected clients
- Commands per second
- Eviction rate
- Replication lag (HA mode)
- Network I/O (bytes in/out)
- Key expiration rate
- CPU usage
- Connection count
- Command latency

**Available in Cloud Monitoring**:
- Real-time dashboards
- Historical data (30 days default)
- Alerting on thresholds
- Custom dashboards

### What We Still Need to Monitor

**Application-level metrics** (not provided by Memorystore):
- Cache hit/miss rates (application logic)
- API response times
- Database query count (before/after caching)
- Rate limit violations
- Cache invalidation events

**These require application instrumentation**

### Monitoring Strategy

#### What's Automatic (No Code)
**Memorystore metrics** → Cloud Monitoring (automatic)
- Memory usage
- Connected clients
- Commands/sec
- Eviction rate
- Replication lag
- Network I/O
- CPU usage
- Connection count
- Command latency

#### What Requires Application Code
**Application metrics** → Cloud Logging (structured JSON)
- Cache hit/miss rates
- API response times
- Database query count
- Rate limit violations
- Cache invalidation events

### Recommended Approach (SIMPLIFIED)

**Memorystore provides Redis metrics automatically**
- No instrumentation needed
- Visible in Cloud Monitoring
- Dashboards in Cloud Console
- Alerting on thresholds

**Application provides business metrics**
- Structured logs to Cloud Logging
- Cache hit/miss rates
- API performance
- Database impact

**Why this is simpler**:
- Memorystore metrics are automatic
- No Prometheus server to manage
- No custom metric collection code
- Cloud Monitoring handles everything
- Just add structured logging to application

### Recommended Approach for This Feature

**Leverage Memorystore + Cloud Logging (SIMPLIFIED)**

**Why**:
1. Memorystore automatically exports Redis metrics
2. Zero infrastructure setup
3. Cloud Monitoring handles dashboards
4. No Prometheus server to manage
5. Just add structured logging to application
6. Cost-effective and minimal overhead

**Implementation**:
1. Memorystore metrics automatically appear in Cloud Monitoring
2. Create dashboard in Cloud Console (Memorystore metrics)
3. Add structured logging to application (pino → Cloud Logging)
4. Set up alerts for anomalies
5. Monitor cache hit/miss rates via logs

**Metrics Automatically Available**:
- Redis memory usage
- Connected clients
- Commands per second
- Eviction rate
- Replication lag (HA)
- Network I/O
- CPU usage
- Connection count
- Command latency

**Application Logging**:
- Use Cloud Logging (built-in)
- Structured JSON logs via pino
- Track cache hit/miss rates
- Monitor API performance
- Log cache invalidation events

### Success Criteria
- Metrics visible in Cloud Console within 5 minutes
- Cache hit rate >80% visible in dashboard
- Latency <100ms for cached requests
- Redis connection status monitored
- Audit trail of cache operations in Cloud Logging
- Alerts configured for anomalies

### Implementation Challenge: Per-Instance Metrics

**Problem**: Application metrics are per-container instance
- Each Cloud Run instance tracks its own cache hits/misses
- Metrics are isolated per instance
- No automatic aggregation across instances
- Cannot get true cache hit rate without manual aggregation

**Example**:
```
Instance 1: 80 hits, 20 misses (80% hit rate)
Instance 2: 60 hits, 40 misses (60% hit rate)
Instance 3: 70 hits, 30 misses (70% hit rate)

True aggregate: 210 hits, 90 misses (70% hit rate)
But each instance only sees its own metrics
```

### Solution: Use Structured Logging Instead

**Why structured logging is better for aggregation**:
1. All logs go to Cloud Logging (centralized)
2. Cloud Logging can aggregate across instances
3. BigQuery integration for analysis
4. No per-instance isolation
5. Simpler to query and analyze

**Recommended approach**:
```typescript
// Instead of per-instance Prometheus metrics,
// use structured logs that Cloud Logging can aggregate

import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-stackdriver',
  },
});

// Log every cache operation
logger.info({
  operation: 'cache_get',
  key: cacheKey,
  hit: true,  // or false
  latency_ms: 5,
  timestamp: new Date().toISOString(),
});

logger.info({
  operation: 'cache_set',
  key: cacheKey,
  latency_ms: 3,
  timestamp: new Date().toISOString(),
});

logger.info({
  operation: 'cache_invalidate',
  keys_invalidated: 5,
  latency_ms: 2,
  timestamp: new Date().toISOString(),
});
```

**Cloud Logging can then aggregate**:
```sql
-- Query to get cache hit rate across all instances
SELECT
  COUNT(*) as total_requests,
  COUNTIF(hit = true) as cache_hits,
  COUNTIF(hit = false) as cache_misses,
  ROUND(100 * COUNTIF(hit = true) / COUNT(*), 2) as hit_rate_percent
FROM `project.dataset.logs`
WHERE operation = 'cache_get'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
```

**Cloud Logging also provides**:
- Real-time log aggregation
- Automatic instance identification (resource labels)
- BigQuery export for historical analysis
- Log-based metrics (automatic aggregation)
- Dashboards and alerting

### Revised Monitoring Strategy

**Automatic (no code)**:
- Memorystore metrics → Cloud Monitoring
- Redis memory, connections, commands/sec, etc.

**Centralized (structured logging)**:
- Application logs → Cloud Logging
- Cache hit/miss rates (aggregated across instances)
- API response times
- Database query impact
- Cache invalidation events

**Why this works**:
1. Memorystore metrics are already aggregated (managed service)
2. Structured logs go to centralized Cloud Logging
3. Cloud Logging handles multi-instance aggregation
4. No per-instance metric isolation
5. Easy to query and analyze

### Implementation Details

#### Structured Logging (Recommended)
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-stackdriver',
  },
});

// Log cache operations with structured fields
logger.info({
  operation: 'cache_get',
  key: cacheKey,
  hit: true,
  latency_ms: 5,
  timestamp: new Date().toISOString(),
});

logger.info({
  operation: 'cache_invalidate',
  keys_invalidated: 5,
  reason: 'dispositif_updated',
  latency_ms: 2,
});

logger.info({
  operation: 'api_response',
  endpoint: '/api/search/counts',
  status: 200,
  latency_ms: 45,
  cache_hit: true,
  database_queries: 0,
});
```

#### Cloud Logging Queries for Aggregation

**Cache hit rate across all instances**:
```sql
SELECT
  TIMESTAMP_TRUNC(timestamp, MINUTE) as minute,
  COUNT(*) as total_requests,
  COUNTIF(hit = true) as cache_hits,
  ROUND(100 * COUNTIF(hit = true) / COUNT(*), 2) as hit_rate_percent
FROM `project.dataset.logs`
WHERE operation = 'cache_get'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
GROUP BY minute
ORDER BY minute DESC
```

**Average latency by operation**:
```sql
SELECT
  operation,
  COUNT(*) as count,
  ROUND(AVG(latency_ms), 2) as avg_latency_ms,
  APPROX_QUANTILES(latency_ms, 100)[OFFSET(50)] as p50_latency_ms,
  APPROX_QUANTILES(latency_ms, 100)[OFFSET(95)] as p95_latency_ms,
  APPROX_QUANTILES(latency_ms, 100)[OFFSET(99)] as p99_latency_ms
FROM `project.dataset.logs`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
GROUP BY operation
```

**Database impact (queries before/after caching)**:
```sql
SELECT
  TIMESTAMP_TRUNC(timestamp, MINUTE) as minute,
  SUM(database_queries) as total_queries,
  COUNT(*) as total_requests,
  ROUND(100 * SUM(database_queries) / COUNT(*), 2) as queries_per_request_percent
FROM `project.dataset.logs`
WHERE operation = 'api_response'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
GROUP BY minute
ORDER BY minute DESC
```

#### Cloud Monitoring Dashboard
Create in Google Cloud Console:
- Memorystore metrics (automatic)
- Redis memory usage
- Connected clients
- Commands per second
- Replication lag (HA)

**Link to Cloud Logging for application metrics**:
- Cache hit rate queries
- API response time analysis
- Database query impact

#### Cloud Logging Configuration
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-stackdriver', // Sends to Cloud Logging
  },
});

// Structured logs automatically appear in Cloud Logging
logger.info({
  operation: 'cache_get',
  key: cacheKey,
  hit: true,
  latency_ms: 5,
  timestamp: new Date().toISOString(),
});
```

### Success Criteria
- Memorystore metrics visible in Cloud Monitoring (automatic)
- Redis memory usage monitored
- Connected clients tracked
- Commands/sec visible
- Eviction rate monitored
- **Cache hit/miss rates aggregated across instances** (Cloud Logging queries)
- **API response times aggregated** (Cloud Logging queries)
- **Database query impact visible** (Cloud Logging queries)
- Structured logs in Cloud Logging
- BigQuery export configured for historical analysis

---

## Summary of Findings

| Research Area | Decision | Status |
|---------------|----------|--------|
| **Redis Resilience & HA** | Memorystore HA (single source of truth) | ✅ Ready |
| **Multi-Instance Architecture** | Redis-only (eliminates sync complexity) | ✅ Ready |
| Cache Invalidation | Explicit mutation + TTL fallback | ✅ Ready |
| **Rate Limiting** | Cloud Load Balancer (infrastructure-level) | ✅ Ready |
| **Monitoring** | Memorystore metrics + Cloud Logging (automatic) | ✅ Ready |

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
3. **HIGH**: Cloud Load Balancer rate limiting (infrastructure-level, no code)
4. **HIGH**: TTL expiration (5-15 min eventual consistency)
5. **MEDIUM**: Monitoring & observability (Prometheus metrics)

### Architecture Simplification Benefits
- ✅ Eliminated per-instance in-memory cache complexity
- ✅ No cross-instance pub/sub or event listeners needed
- ✅ Single source of truth (Redis HA)
- ✅ Instant cache invalidation across all instances
- ✅ Easier to debug and operate
- ✅ Memorystore HA provides resilience without application complexity
