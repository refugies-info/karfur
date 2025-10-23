# Quickstart Guide: Redis Caching for Search Counts API

**Feature**: Redis Caching for Search Counts API  
**Duration**: ~2-3 weeks (5 sprints)  
**Complexity**: Medium  
**Team Size**: 1-2 engineers

---

## Overview

This guide walks you through implementing Redis caching for the `/api/search/counts` endpoint to reduce database load by 70%+ and improve response times from 500ms+ to <100ms.

**Key Components**:
- Google Cloud Memorystore (Redis HA)
- Cloud Load Balancer + Cloud Armor (rate limiting)
- Next.js API route with caching logic
- Cloud Logging for monitoring
- Cloud Monitoring dashboards

---

## Prerequisites

- Node.js 22.x LTS
- TypeScript knowledge
- Google Cloud Platform access
- MongoDB connection (existing)
- Familiarity with Next.js API routes

---

## Architecture Overview

```
┌─────────────────┐
│   Client App    │
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Cloud Load Balancer        │
│  + Cloud Armor (Rate Limit) │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Cloud Run                  │
│  /api/search/counts         │
│  (Next.js API Route)        │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌──────────────┐
│ Redis  │  │  MongoDB     │
│ Cache  │  │  (fallback)  │
└────────┘  └──────────────┘
```

---

## Step 1: Set Up Google Cloud Infrastructure (Day 1)

### 1.1 Create Memorystore HA Instance

```bash
# Create Redis HA instance
gcloud redis instances create search-counts-cache \
  --size=2 \
  --region=europe-west1 \
  --redis-version=7.0 \
  --tier=standard \
  --enable-auth \
  --display-name="Search Counts Cache"

# Get connection details
gcloud redis instances describe search-counts-cache \
  --region=europe-west1
```

**Store these values**:
- `REDIS_HOST`: Internal IP address
- `REDIS_PORT`: Usually 6379
- `REDIS_PASSWORD`: Generated password

### 1.2 Configure Cloud Load Balancer

```bash
# Create security policy with rate limiting
gcloud compute security-policies create search-counts-rate-limit \
  --description="Rate limiting for search counts API"

# Add rate limiting rule (10 req/sec per IP)
gcloud compute security-policies rules create 1000 \
  --security-policy=search-counts-rate-limit \
  --action=rate-based-ban \
  --rate-limit-options-conform-action=allow \
  --rate-limit-options-exceed-action=deny-429 \
  --rate-limit-options-enforce-on-key=IP \
  --rate-limit-options-ban-duration-sec=60 \
  --rate-limit-options-rate-limit-threshold-count=10 \
  --rate-limit-options-rate-limit-threshold-interval-sec=1
```

### 1.3 Enable Cloud Monitoring & Logging

```bash
# Already enabled by default on Cloud Run
# Verify Memorystore metrics are available
gcloud monitoring metrics-descriptors list \
  --filter="metric.type:redis*"
```

---

## Step 2: Implement Cache Layer (Days 2-3)

### 2.1 Create Redis Connection Module

**File**: `apps/client/src/libs/redis.ts`

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  console.log('Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;
```

### 2.2 Create Cache Abstraction Layer

**File**: `apps/client/src/libs/cache.ts`

```typescript
import redis from './redis';
import { createHash } from 'crypto';

interface CacheEntry {
  version: number;
  timestamp: string;
  ttl: number;
  data: any;
}

const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || '600');

function generateCacheKey(language: string, filters: Record<string, any>): string {
  const sortedFilters = JSON.stringify(filters, Object.keys(filters).sort());
  const hash = createHash('sha256').update(sortedFilters).digest('hex');
  return `cache:search_counts:${language}:${hash}`;
}

async function getCached(language: string, filters: Record<string, any>): Promise<any | null> {
  try {
    const key = generateCacheKey(language, filters);
    const value = await redis.get(key);
    
    if (value) {
      const entry: CacheEntry = JSON.parse(value);
      return entry.data;
    }
    
    return null;
  } catch (error) {
    console.warn('Cache get failed:', error);
    return null;
  }
}

async function setCached(
  language: string,
  filters: Record<string, any>,
  data: any
): Promise<void> {
  try {
    const key = generateCacheKey(language, filters);
    const entry: CacheEntry = {
      version: 1,
      timestamp: new Date().toISOString(),
      ttl: CACHE_TTL_SECONDS,
      data,
    };
    
    await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(entry));
  } catch (error) {
    console.warn('Cache set failed:', error);
  }
}

async function invalidateByFilters(filters: Record<string, any>): Promise<void> {
  try {
    // Invalidate for all supported languages
    const languages = ['fr', 'en', 'uk', 'ti', 'ar', 'ps', 'ru', 'fa'];
    
    for (const language of languages) {
      const key = generateCacheKey(language, filters);
      await redis.del(key);
    }
  } catch (error) {
    console.warn('Cache invalidation failed:', error);
  }
}

export { getCached, setCached, invalidateByFilters, generateCacheKey };
```

### 2.3 Create Cache Invalidation Logic

**File**: `apps/client/src/libs/cacheInvalidation.ts`

```typescript
import { invalidateByFilters } from './cache';
import logger from './logger';

interface Dispositif {
  _id: string;
  themes?: string[];
  needs?: string[];
  frenchLevel?: string[];
  status?: string;
  type?: string;
}

async function invalidateOnDispoChange(dispositif: Dispositif): Promise<void> {
  try {
    // Create filter combinations that would match this dispositif
    const filters = {
      themes: dispositif.themes || [],
      needs: dispositif.needs || [],
      frenchLevel: dispositif.frenchLevel || [],
      status: dispositif.status ? [dispositif.status] : [],
      type: dispositif.type ? [dispositif.type] : [],
    };
    
    await invalidateByFilters(filters);
    
    logger.info({
      operation: 'cache_invalidate',
      trigger: 'dispositif_changed',
      dispositif_id: dispositif._id,
      keys_invalidated: 1,
    });
  } catch (error) {
    logger.error({
      operation: 'cache_invalidate',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export { invalidateOnDispoChange };
```

---

## Step 3: Implement API Route (Days 4-5)

### 3.1 Create Search Counts API Route

**File**: `apps/client/src/pages/api/search/counts.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCached } from '@/libs/cache';
import logger from '@/libs/logger';
import { getSearchCounts } from '@/services/searchService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse query parameters
    // Validate language is supported
    const supportedLanguages = ['fr', 'en', 'uk', 'ti', 'ar', 'ps', 'ru', 'fa'];
    const language = request.nextUrl.searchParams.get('language') || 'fr';
    
    if (!supportedLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Bad Request', message: `Invalid language: '${language}'. Supported: ${supportedLanguages.join(', ')}` },
        { status: 400 }
      );
    }
    // Parse theme and need MongoDB ObjectIds
    const themes = request.nextUrl.searchParams.get('themes')?.split(',').filter(Boolean) || [];
    const needs = request.nextUrl.searchParams.get('needs')?.split(',').filter(Boolean) || [];
    const frenchLevel = request.nextUrl.searchParams.get('frenchLevel')?.split(',').filter(Boolean) || [];
    const status = request.nextUrl.searchParams.get('status')?.split(',').filter(Boolean) || [];
    const type = request.nextUrl.searchParams.get('type')?.split(',').filter(Boolean) || [];
    const search = request.nextUrl.searchParams.get('search') || '';
    
    // Build filters object
    const filters = {
      themes,
      needs,
      frenchLevel,
      status,
      type,
      search,
    };
    
    // Try cache first
    let data = await getCached(language, filters);
    let cacheHit = !!data;
    let cacheAge = 0;
    
    // If not cached, query database
    if (!data) {
      data = await getSearchCounts(language, filters);
      await setCached(language, filters, data);
    } else {
      cacheAge = Math.floor((Date.now() - Date.parse(data.timestamp)) / 1000);
    }
    
    const latency = Date.now() - startTime;
    
    // Log operation
    logger.info({
      operation: 'api_response',
      endpoint: '/api/search/counts',
      status: 200,
      cache_hit: cacheHit,
      database_queries: cacheHit ? 0 : 1,
      latency_ms: latency,
      language,
    });
    
    // Return response
    return NextResponse.json(
      {
        ...data,
        cached: cacheHit,
        cacheAge: cacheHit ? cacheAge : undefined,
      },
      {
        status: 200,
        headers: {
          'X-Cache-Hit': cacheHit ? 'true' : 'false',
          'X-Cache-Age': cacheAge.toString(),
          'X-Cache-TTL': '600',
        },
      }
    );
  } catch (error) {
    logger.error({
      operation: 'api_response',
      endpoint: '/api/search/counts',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

---

## Step 4: Set Up Monitoring (Day 6)

### 4.1 Create Cloud Logging Logger

**File**: `apps/client/src/libs/logger.ts`

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-stackdriver',
  },
});

export default logger;
```

### 4.2 Create Cloud Monitoring Dashboard

```bash
# Create dashboard with Memorystore metrics
gcloud monitoring dashboards create --config='{
  "displayName": "Search Counts Cache",
  "mosaicLayout": {
    "columns": 12,
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Redis Memory Usage",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"redis.googleapis.com/memory/usage\" resource.type=\"redis_instance\""
                }
              }
            }]
          }
        }
      },
      {
        "xPos": 6,
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Commands/sec",
          "xyChart": {
            "dataSets": [{
              "timeSeriesQuery": {
                "timeSeriesFilter": {
                  "filter": "metric.type=\"redis.googleapis.com/commands_per_second\" resource.type=\"redis_instance\""
                }
              }
            }]
          }
        }
      }
    ]
  }
}'
```

### 4.3 Set Up Cloud Logging Queries

```sql
-- Cache hit rate (run in Cloud Logging)
SELECT
  TIMESTAMP_TRUNC(timestamp, MINUTE) as minute,
  COUNT(*) as total_requests,
  COUNTIF(cache_hit = true) as cache_hits,
  ROUND(100 * COUNTIF(cache_hit = true) / COUNT(*), 2) as hit_rate_percent
FROM `project.dataset.logs`
WHERE operation = 'api_response'
  AND endpoint = '/api/search/counts'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
GROUP BY minute
ORDER BY minute DESC
```

---

## Step 5: Testing & Deployment (Days 7-10)

### 5.1 Unit Tests

**File**: `apps/client/src/libs/__tests__/cache.test.ts`

```typescript
import { getCached, setCached, generateCacheKey } from '../cache';
import redis from '../redis';

describe('Cache Layer', () => {
  afterEach(async () => {
    await redis.flushdb();
  });

  it('should cache and retrieve data', async () => {
    const filters = { themes: ['health'] };
    const data = { total: 100 };

    await setCached('fr', filters, data);
    const cached = await getCached('fr', filters);

    expect(cached).toEqual(data);
  });

  it('should return null for missing cache', async () => {
    const filters = { themes: ['health'] };
    const cached = await getCached('fr', filters);

    expect(cached).toBeNull();
  });

  it('should generate consistent cache keys', () => {
    const filters = { themes: ['health'], needs: ['legal'] };
    const key1 = generateCacheKey('fr', filters);
    const key2 = generateCacheKey('fr', filters);

    expect(key1).toBe(key2);
  });
});
```

### 5.2 Load Testing

```bash
# Install k6
brew install k6

# Create load test
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<100'],
    http_req_failed: ['<1%'],
  },
};

export default function () {
  const url = 'http://localhost:3000/api/search/counts?language=fr&themes=63286a015d31b2c0cad9960f,63286a015d31b2c0cad9960c&needs=613721a409c5190dfa70d053,614d9a3e95b9b700142ef6c4&frenchLevel=A1,A2&status=PUBLISHED';
  const res = http.get(url);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 100ms': (r) => r.timings.duration < 100,
  });
}
EOF

# Run load test
k6 run load-test.js
```

### 5.3 Deployment

```bash
# Deploy to Cloud Run
gcloud run deploy search-counts-api \
  --source . \
  --platform managed \
  --region europe-west1 \
  --set-env-vars REDIS_HOST=$REDIS_HOST,REDIS_PORT=6379,REDIS_PASSWORD=$REDIS_PASSWORD \
  --allow-unauthenticated
```

---

## Verification Checklist

- [ ] Memorystore HA instance running
- [ ] Cloud Load Balancer configured with rate limiting
- [ ] Redis connection working
- [ ] Cache layer implemented
- [ ] API route caching results
- [ ] Cloud Logging receiving logs
- [ ] Memorystore metrics visible in Cloud Monitoring
- [ ] Cache hit rate >80%
- [ ] Cached response latency <100ms
- [ ] Database load reduced by 70%+
- [ ] Load testing passed
- [ ] Deployment successful

---

## Troubleshooting

### Redis Connection Failed
```bash
# Check Memorystore instance
gcloud redis instances describe search-counts-cache --region=europe-west1

# Verify network connectivity
gcloud compute ssh <instance> --zone=<zone> -- \
  redis-cli -h $REDIS_HOST -p 6379 -a $REDIS_PASSWORD ping
```

### Low Cache Hit Rate
- Check cache invalidation logic
- Verify TTL is appropriate
- Monitor filter combinations in logs

### High Latency
- Check Redis memory usage
- Verify Cloud Run instance size
- Review database query performance

---

## Next Steps

1. ✅ Phase 1: Data model, contracts, quickstart complete
2. ⏳ Phase 2: Run `/speckit.tasks` to generate tasks.md
3. ⏳ Implementation: Follow tasks.md for sprint planning

**Status**: Ready for implementation! 🚀
