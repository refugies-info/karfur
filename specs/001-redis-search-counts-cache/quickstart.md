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
- Application-level rate limiting with @upstash/ratelimit (Redis backend)
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
│  Cloud Run                  │
│  /api/search/counts         │
│  + @upstash/ratelimit       │
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

### 1.2 Configure Application-Level Rate Limiting

```bash
# Create rate limiter with Redis backend
npm install @upstash/ratelimit
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

### 2.1 Set Up Monitoring (Required for All Cache Operations)

**Note**: Set up monitoring first to have proper structured logging available throughout all cache modules.

#### 2.1.1 Create Cloud Logging Logger

**File**: `packages/infra/src/logger/gcp-logger.ts`

First create the infrastructure package structure:

```bash
# Create package directories
mkdir -p packages/infra/src/cache packages/infra/src/logger

# Create package.json for the shared infra package
cat > packages/infra/package.json << 'EOF'
{
  "name": "@refugies-info/infra",
  "version": "1.0.0",
  "description": "Shared infrastructure utilities for cache and logging",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "keywords": ["infrastructure", "cache", "logging", "redis"],
  "author": "refugies.info",
  "license": "MIT"
}
EOF

# Create TypeScript config
cat > packages/infra/tsconfig.json << 'EOF'
{
  "extends": "@refugies-info/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF
```

Then install the required dependencies in the infra package:

```bash
cd packages/infra
pnpm add ioredis pino @google-cloud/pino-logging-gcp-config @upstash/ratelimit
```

Finally, add the infra package as a dependency to both apps:

```bash
cd apps/client && pnpm add @refugies-info/infra@workspace:*
cd apps/server && pnpm add @refugies-info/infra@workspace:*
```

**Note**: `@google-cloud/pino-logging-gcp-config` is the official Google package for proper Cloud Logging integration. The older `pino-stackdriver` package is deprecated. `@refugies-info/infra` is our shared infrastructure package containing cache and logging utilities.

```typescript
import pino from 'pino';
import { createGcpLoggingPinoConfig } from '@google-cloud/pino-logging-gcp-config';

// Create logger configuration that works both locally and in production
const loggerConfig = createGcpLoggingPinoConfig({
  serviceContext: {
    service: 'search-counts-cache', // Name of your service
    version: '1.0.0', // Your app version
  },
}, {
  level: process.env.LOG_LEVEL || 'info',
});

const logger = pino(loggerConfig);

export default logger;
```

**Local Development**: When running locally, this automatically falls back to pretty-printed console output. No additional configuration needed.

**Production**: When deployed to Cloud Run, automatically integrates with Google Cloud Logging with structured JSON output.

**File**: `packages/infra/src/logger/gcp-logger.ts`

#### 2.1.2 Create Cloud Monitoring Dashboard

**File**: `apps/client/monitoring/search-counts-dashboard.json`

Create the dashboard configuration and deploy it:

```bash
# Create monitoring directory
mkdir -p apps/client/monitoring

# Create dashboard configuration file
cat > apps/client/monitoring/search-counts-dashboard.json << 'EOF'
{
  "displayName": "Search Counts Cache Performance",
  "gridLayout": {
    "columns": "12",
    "widgets": [
      {
        "title": "Redis Memory Usage",
        "xyChart": {
          "dataSets": [{
            "timeSeriesQuery": {
              "prometheusQueryEndpoint": {
                "query": "redis_memory_usage_bytes"
              }
            },
            "plotType": "LINE",
            "legendTemplate": "Instance {{instance}}"
          }],
          "timeshiftDuration": "0s",
          "yAxis": {
            "label": "Memory (bytes)",
            "scale": "LINEAR"
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
  ```

# Deploy the dashboard to Google Cloud Monitoring
gcloud monitoring dashboards create --config-file=apps/client/monitoring/search-counts-dashboard.json
```

**How the Dashboard JSON Works:**

The JSON file contains:
- **Dashboard metadata** (name, layout)
- **Widget definitions** (charts, metrics, alerts)
- **Time series queries** (what metrics to display)
- **Visualization settings** (colors, thresholds, axes)

**Deployment Methods:**

1. **gcloud CLI** (recommended for automation):
   ```bash
   gcloud monitoring dashboards create --config-file=dashboard.json
   ```

2. **Cloud Console UI** (for manual creation):
   - Navigate to Monitoring → Dashboards
   - Click "Create Dashboard"
   - Copy-paste JSON configuration

3. **REST API** (for programmatic creation):
   ```bash
   curl -X POST \
     "https://monitoring.googleapis.com/v1/projects/${PROJECT_ID}/dashboards" \
     -H "Authorization: Bearer $(gcloud auth print-access-token)" \
     -H "Content-Type: application/json" \
     -d @dashboard.json
   ```

The dashboard will appear in your Cloud Console at Monitoring → Dashboards.

#### 2.1.3 Cloud Logging Queries for Analysis

**File**: `apps/client/docs/MONITORING_QUERIES.md`

Create documentation with pre-built queries for log analysis:

```bash
# Create docs directory
mkdir -p apps/client/docs

# Create monitoring queries documentation
cat > apps/client/docs/MONITORING_QUERIES.md << 'EOF'
# Cloud Monitoring Queries for Search Counts Cache

## How to Use These Queries

### Method 1: Cloud Logging Console (Interactive)
1. Navigate to Cloud Logging → Log Explorer
2. Copy and paste each query into the query editor
3. Run query to analyze real-time data
4. Click "Save query" to save for future use

### Method 2: Saved Queries (Quick Access)
1. In Log Explorer, click "Saved queries"
2. Click "New query" and paste the query
3. Name it (e.g., "Cache Hit Rate Analysis")
4. Access quickly from the dropdown menu

### Method 3: gcloud CLI (Automation)
```bash
gcloud logging read "YOUR_QUERY_HERE" --format=json --limit=100
```

## Pre-built Queries

### Cache Hit Rate Analysis
```sql
SELECT
  TIMESTAMP_TRUNC(timestamp, MINUTE) as minute,
  COUNT(*) as total_requests,
  COUNTIF(jsonPayload.cache_hit = true) as cache_hits,
  ROUND(100 * COUNTIF(jsonPayload.cache_hit = true) / COUNT(*), 2) as hit_rate_percent
FROM \`project.dataset.logs\`
WHERE jsonPayload.operation = "api_response"
  AND jsonPayload.endpoint = "/api/search/counts"
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
GROUP BY minute
ORDER BY minute DESC
```

### Latency Tracking
```sql
SELECT
  jsonPayload.latency_ms,
  COUNT(*) as frequency
FROM \`project.dataset.logs\`
WHERE jsonPayload.operation = "api_response"
  AND jsonPayload.endpoint = "/api/search/counts"
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOURS)
GROUP BY jsonPayload.latency_ms
ORDER BY frequency DESC
```

### Database Load Reduction
```sql
SELECT
  TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
  COUNT(*) as total_requests,
  COUNTIF(jsonPayload.cache_hit = false) as db_queries,
  ROUND(100 * COUNTIF(jsonPayload.cache_hit = false) / COUNT(*), 2) as db_query_percent
FROM \`project.dataset.logs\`
WHERE jsonPayload.operation = "api_response"
  AND jsonPayload.endpoint = "/api/search/counts"
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAYS)
GROUP BY hour
ORDER BY hour DESC
```
EOF
```

**Query Usage in Cloud Console:**

1. **Interactive Analysis**: Run queries in Cloud Logging console for real-time troubleshooting
2. **Saved Queries**: Save frequently used queries for quick access  
3. **Alert Integration**: Use query results to set up log-based metrics and alerts
4. **Dashboard Integration**: Add query results as panels in custom dashboards

**Unlike dashboard JSON, these queries are for human analysis, not automated deployment.**

#### 2.2.1 Create Redis Connection Module

**File**: `packages/infra/src/cache/redis.ts`

```typescript
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: { rejectUnauthorized: false },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
```

#### 2.2.2 Create Cache Abstraction Layer

**File**: `packages/infra/src/cache/main.ts`

```typescript
import redis from "./redis";
import { createHash } from "crypto";
import { logger } from "../logger";

interface CacheEntry {
  version: number;
  timestamp: string;
  ttl: number;
  data: any;
}

const CACHE_TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS || "600");

export const generateCacheKey = (language: string, filters: Record<string, any>): string => {
  const sortedFilters = JSON.stringify(filters, Object.keys(filters).sort());
  const hash = createHash("sha256").update(sortedFilters).digest("hex");
  return `cache:search_counts:${language}:${hash}`;
};

export const getCached = async (language: string, filters: Record<string, any>): Promise<any | null> => {
  try {
    const key = generateCacheKey(language, filters);
    const value = await redis.get(key);

    if (value) {
      const entry: CacheEntry = JSON.parse(value);
      return entry.data;
    }

    return null;
  } catch (error) {
    console.warn("Cache get failed:", error);
    return null;
  }
};

export const setCached = async (language: string, filters: Record<string, any>, data: any): Promise<void> => {
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
    console.warn("Cache set failed:", error);
  }
};
```

#### 2.2.3 Create Cache Invalidation Logic

**File**: `packages/infra/src/cache/invalidation.ts`

```typescript
import redis from "./redis";
import { generateCacheKey } from "./main";
import { logger } from "../logger";

// Invalidate cache entries by filter combinations for all languages
export const invalidateByFilters = async (filters: Record<string, any>): Promise<void> => {
  try {
    // Invalidate for all supported languages
    const languages = ["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"];

    for (const language of languages) {
      const key = generateCacheKey(language, filters);
      await redis.del(key);
    }

    logger.info({
      operation: "cache_invalidate",
      trigger: "filters_invalidated",
      filters,
      keys_invalidated: languages.length,
    });
  } catch (error) {
    logger.error({
      operation: "cache_invalidate",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

interface Dispositif {
  _id: string;
  themes?: string[];
  needs?: string[];
  frenchLevel?: string[];
  status?: string;
  type?: string;
}

export const invalidateOnDispoChange = async (dispositif: Dispositif): Promise<void> => {
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
      operation: "cache_invalidate",
      trigger: "dispositif_changed",
      dispositif_id: dispositif._id,
      dispositif_themes: dispositif.themes,
      dispositif_needs: dispositif.needs,
      keys_invalidated: 8, // Number of languages
    });
  } catch (error) {
    logger.error({
      operation: "cache_invalidate",
      trigger: "dispositif_changed",
      dispositif_id: dispositif._id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
```

#### 2.2.4 Create Public Interface

**File**: `packages/infra/src/index.ts` (Main exports)

```typescript
// Main public interface - clean imports for consumers
export { cache, logger } from './src';

// Or specific exports
export * from './src/cache';
export * from './src/logger';
```

**File**: `packages/infra/src/cache/index.ts` (Cache-specific exports)

```typescript
// Re-export all cache functions for clean public interface
export { getCached, setCached, generateCacheKey } from "./main";
export { invalidateByFilters, invalidateOnDispoChange } from "./invalidation";
export { default as redis } from "./redis";

// Export types
export type { CacheEntry } from "./main";
export type { Dispositif } from "./invalidation";
```

**File**: `packages/infra/src/logger/index.ts` (Logger exports)

```typescript
// Export logger configuration
export { default as logger } from "./gcp-logger";
```

**Usage Examples:**

```typescript
// In client app
import { cache, logger } from '@refugies-info/infra';
import { getCached, invalidateByFilters } from '@refugies-info/infra/cache';

// In server app  
import { invalidateByFilters } from '@refugies-info/infra/cache';
import { logger } from '@refugies-info/infra/logger';
```

**Testing:**

The shared package includes comprehensive test coverage:
- Unit tests for each module (`packages/infra/src/**/__tests__/`)
- Integration tests for package-level functionality
- Type safety tests for TypeScript interfaces
- Mock Redis and GCP logging for test isolation

Run tests with: `cd packages/infra && pnpm test`

---

## Step 3: Implement API Route (Days 4-5)

### 3.1 Search Counts API Route

**File**: `apps/client/src/pages/api/search/counts.ts`

The API route is already implemented in the codebase. It provides:

- **Endpoint**: `GET /api/search/counts`
- **Query Parameters**: language (required), themes, needs, frenchLevel, status, public, age, departments, sort, search
- **Response**: SearchCountsResponse with counts grouped by themes, needs, frenchLevels, ageRanges, publics, languages, statuses, and types
- **Features**:
  - MongoDB aggregation pipeline for efficient counting
  - Algolia integration for free-text search
  - Faceted counts across all filter dimensions
  - Proper error handling and validation

**Key Implementation Details**:

- Uses `computeSearchCounts()` function for MongoDB aggregation
- Supports all query parameters from the search-helpers
- Returns structured counts for UI filtering
- Handles method validation (GET only)
- Can be disabled via `DISABLE_SEARCH_COUNTS` environment variable

**Next Steps for Caching Integration**:

1. Import cache functions from `~/libs/cache`
2. Add Redis caching layer around `computeSearchCounts()`
3. Implement cache invalidation on dispositif mutations  
4. Add rate limiting via @upstash/ratelimit
5. Add structured logging for monitoring

---

## Step 4: Testing & Deployment (Days 7-10)

### 4.1 Unit Tests

**File**: `apps/client/src/libs/__tests__/cache.test.ts`

```typescript
import { getCached, setCached, generateCacheKey } from "../cache";
import redis from "../redis";

describe("Cache Layer", () => {
  afterEach(async () => {
    await redis.flushdb();
  });

  it("should cache and retrieve data", async () => {
    const filters = { themes: ["health"] };
    const data = { total: 100 };

    await setCached("fr", filters, data);
    const cached = await getCached("fr", filters);

    expect(cached).toEqual(data);
  });

  it("should return null for missing cache", async () => {
    const filters = { themes: ["health"] };
    const cached = await getCached("fr", filters);

    expect(cached).toBeNull();
  });

  it("should generate consistent cache keys", () => {
    const filters = { themes: ["health"], needs: ["legal"] };
    const key1 = generateCacheKey("fr", filters);
    const key2 = generateCacheKey("fr", filters);

    expect(key1).toBe(key2);
  });
});
```

### 4.2 Load Testing

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

### 4.3 Deployment

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
