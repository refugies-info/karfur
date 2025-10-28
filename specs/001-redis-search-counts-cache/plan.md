# Implementation Plan: Redis Caching for Search Counts API

**Branch**: `001-redis-search-counts-cache` | **Date**: 2025-10-23 | **Spec**: [RI-914](https://linear.app/refugiesinfo/issue/RI-914/implement-redis-caching-for-search-counts-api)
**Input**: Feature specification from `/specs/001-redis-search-counts-cache/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement Redis caching architecture for the GET `/api/search/counts` endpoint to reduce database load by 70%+ and improve response times from 500ms+ to <100ms. Includes selective cache invalidation based on dispositif attributes, rate limiting (10 req/sec per IP), and client-side debouncing (300-500ms). Leverages existing Google Cloud Memorystore infrastructure.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (Node.js 22.x LTS)  
**Primary Dependencies**: redis (ioredis), Next.js  
**Storage**: Redis (Google Cloud Memorystore), MongoDB (existing)  
**Testing**: Jest (unit/integration), manual load testing for cache hit rates  
**Target Platform**: Next.js API routes (Cloud Run)  
**Project Type**: Client app only (Next.js)
**Performance Goals**: <100ms cached response time, >80% cache hit rate, 70%+ database load reduction  
**Constraints**: <100ms Redis cache response time, <50MB Redis memory footprint, high availability across multiple instances  
**Scale/Scope**: Single API endpoint, Redis-only caching, 3 user stories, 14 functional requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Accessibility First** | ✅ PASS | API endpoint is non-UI; rate limiting includes configurable allowances for batch operations (SC-015). Monitoring dashboard must follow RGAA 4 standards. |
| **II. Multilingual by Design** | ✅ PASS | Cache keys include language parameter (FR-002). Search counts respect language filters. No user-facing text in API responses. |
| **III. Progressive Migration** | ✅ PASS | Uses modern TypeScript/Node.js stack. Leverages existing GCP infrastructure (Translation API, Indexing API already use Google Cloud). |
| **IV. Monorepo Consistency** | ✅ PASS | Follows Turborepo conventions. Uses pnpm for dependency management. Cache utilities in `/apps/client/src/libs/`. |
| **V. Government Standards** | ✅ PASS | Rate limiting prevents abuse (government service best practice). Audit logging for all cache operations (FR-010). |
| **VI. Mobile-First UI** | N/A | API endpoint only; no UI component. |

**Gate Status**: ✅ **PASS** - All applicable principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
packages/infra/
├── src/
│   ├── cache/
│   │   ├── index.ts           # Public interface for cache operations
│   │   ├── redis.ts           # Redis connection & initialization
│   │   ├── main.ts            # Core cache layer abstraction (Redis only)
│   │   ├── invalidation.ts    # Selective invalidation logic
│   │   └── types.ts           # TypeScript types
│   ├── logger/
│   │   ├── index.ts           # Logger exports
│   │   └── gcp-logger.ts      # Google Cloud Logging configuration
│   └── index.ts               # Main public interface
├── package.json
├── tsconfig.json
└── tests/
    ├── unit/
    │   ├── cache/
    │   │   ├── redis.test.ts          # Redis connection handling
    │   │   ├── main.test.ts           # Core cache operations
    │   │   ├── invalidation.test.ts   # Selective invalidation logic
    │   │   └── types.test.ts          # TypeScript type safety
    │   ├── logger/
    │   │   └── gcp-logger.test.ts     # GCP logging integration
    │   └── integration/
    │       └── package-integration.test.ts # End-to-end package usage

apps/client/
├── src/
│   ├── pages/
│   │   └── api/
│   │       └── search/
│   │           └── counts.ts     # Next.js API route with caching (accesses MongoDB directly)
│   ├── components/
│   │   └── SearchFilters.tsx     # Client-side debouncing
│   └── hooks/
│       └── useSearchCountsCache.ts    # Enhanced debounced search counts hook (wraps existing context)
└── package.json                    # Depends on @refugies-info/infra

apps/server/
├── src/
│   └── workflows/
│       └── dispositif/
│           ├── createDispositif/createDispositif.ts      # Cache invalidation on create
│           └── updateDispositifStatus/updateDispositifStatus.ts # Cache invalidation on update
└── package.json                    # Depends on @refugies-info/infra
```

**Structure Decision**: Shared infrastructure package `@refugies-info/infra`. Cache and logging utilities organized in `/packages/infra/` as a shared package that both client and server apps can depend on. This eliminates architectural dependency issues while enabling server-side cache invalidation. Cache modules in `src/cache/` with organized subfolders, logger in `src/logger/`, and main public interface in `src/index.ts`. API endpoint in `/apps/client/src/pages/api/search/counts.ts` (Next.js) with direct MongoDB access and shared cache library. Server-side workflows use same shared package for cache invalidation. Client-side debouncing in search component. Rate limiting via application-level @upstash/ratelimit. Workspace dependencies configured via pnpm-workspace.yaml.

## Complexity Tracking

*No Constitution Check violations. All complexity justified by requirements.*

---

## Phase 0: Research & Unknowns

**Status**: All technical context clarified. No NEEDS CLARIFICATION items.

### Key Research Areas

1. **Redis Connection Pooling**: ioredis handles connection pooling automatically; verify cluster mode compatibility with Google Cloud Memorystore
2. **Cache Invalidation in Client-Only Architecture**: How does Next.js API route detect dispositif data changes? Options:
   - Webhook/event listener triggered by data mutations
   - Cache invalidation on API calls (explicit, not automatic)
   - Pub/sub subscription within API route
3. **Next.js Middleware Rate Limiting**: Verify Next.js middleware supports per-IP rate limiting; handle `x-forwarded-for` header for Cloud Run container environment
4. **Redis Cache Eviction**: Redis LRU strategy; verify memory footprint limits with Memorystore configuration
5. **Monitoring & Observability**: Prometheus metrics for cache hit/miss rates, latency, connection status

**Output**: research.md (Phase 0 deliverable)

### Implementation Notes

**Cache Invalidation Strategy**: With client-only architecture, cache invalidation must be triggered by:
- Explicit invalidation on dispositif mutations (CREATED, PUBLISHED, DELETED, ARCHIVED)
- Pub/sub subscription to invalidation events (if event system available)
- TTL expiration as fallback (5-15 minutes)

**Rate Limiting Implementation**: Application-level rate limiting using @upstash/ratelimit with Redis backend, suitable for Cloud Run container environment. No additional infrastructure required beyond existing Redis Memorystore.

**High Availability**: Redis Memorystore HA provides automatic failover and distributed caching across all Cloud Run instances.

---

## Phase 1: Design & Contracts

**Prerequisites**: research.md complete

### Deliverables

1. **data-model.md**: Cache entry schema, invalidation event structure, rate limit state
2. **contracts/**: OpenAPI spec for cache admin endpoint, rate limit response headers
3. **quickstart.md**: Local development setup (Redis Docker, environment variables)
4. **Agent Context Update**: Run `.specify/scripts/bash/update-agent-context.sh windsurf`

**Output**: data-model.md, /contracts/*, quickstart.md, updated agent context

---

## Phase 2: Task Generation

**Prerequisites**: Phase 1 design complete

**Command**: `/speckit.tasks` (generates tasks.md with implementation breakdown)

**Output**: tasks.md with dependency-ordered tasks

---

## Next Steps

1. ✅ **Specification**: Complete with all clarifications resolved
2. ✅ **Plan**: Complete with technical context and constitution check
3. ⏳ **Phase 0**: Generate research.md
4. ⏳ **Phase 1**: Generate data-model.md, contracts/, quickstart.md
5. ⏳ **Phase 2**: Run `/speckit.tasks` to generate tasks.md

**Status**: Plan complete. Ready for Phase 0 research generation.
