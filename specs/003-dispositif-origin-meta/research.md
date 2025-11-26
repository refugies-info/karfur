# Research Findings: Dispositif Origin Metadata

**Feature**: Dispositif Origin Metadata (RI-977)
**Date**: 2025-11-18
**Phase**: Phase 0 – Research & Unknowns Resolution

---

## Research Question 1: Mongo Schema Update Path

**Question**: Should we rewrite existing documents during migration or rely on read-time defaults?

### Decision: Lazy Read-Time Default

**Rationale**:

- Minimizes migration downtime and complexity
- Avoids bulk write operations on ~8k documents
- Backward-compatible: missing `origin` field safely defaults to `RI` in serializers
- Allows gradual rollout without requiring database maintenance window

**Implementation**:

1. Add `origin` field to Mongoose schema with `enum: ["RI", "RCO"]` and `default: "RI"`
2. Existing documents without `origin` will use the default when queried
3. New/updated records will always have `origin` explicitly set
4. Optional future migration script can backfill if needed for analytics/reporting

**Alternatives Considered**:

- **Bulk rewrite during deployment**: Faster consistency but requires downtime; rejected due to operational risk
- **Lazy write-on-read**: More complex; rejected in favor of simpler read-time default

---

## Research Question 2: API Propagation Inventory

**Question**: Which API/SSR fetch paths deliver dispositifs and need origin field?

### Decision: Comprehensive Propagation via Shared DTOs

**Rationale**:

- Centralize origin in both `DispositifResponse` and `SimpleDispositif` interfaces
- All serializers inherit the field automatically
- Reduces risk of missing endpoints
- `SimpleDispositif` is used extensively in frontend search/filtering logic (83+ matches)

**Affected DTOs**:

1. `DispositifResponse` - Full dispositif details (API responses)
2. `SimpleDispositif` - Lightweight dispositif for search/list operations (frontend uses extensively)

**Affected Endpoints & Paths**:

#### Server-Side Rendering (SSR) & API Routes

1. **Catalogue/Search Listing**
   - `GET /api/dispositifs` (count, list)
   - `GET /api/dispositifs/search` (search with filters)
   - SSR: `pages/recherche.tsx` (server-side data fetch)

2. **Detail Pages**
   - `GET /api/dispositifs/:id` (single dispositif)
   - SSR: `pages/dispositif/[id]/index.tsx` (server-side data fetch)

3. **Favorites & Recommendations**
   - `GET /api/user/favorites` (returns dispositif summaries)
   - `GET /api/dispositifs/recommendations` (if exists)

4. **Sitemap & SEO**
   - Sitemap generation queries (if dispositifs are included)

5. **Admin/Analytics**
   - `GET /api/admin/dispositifs` (admin dashboard queries)
   - Export endpoints (if any)

#### Client-Side Fetches

- React component hydration (if any client-side fetches after SSR)
- Search filters component (if it fetches dispositif counts separately)

#### Serialization Points

- `DispositifAdapter` (converts Mongo document → API response)
- All response DTOs that include dispositif data

**Implementation Strategy**:

1. Update `DispositifResponse` interface in `@refugies-info/api-types` to include `origin: "RI" | "RCO"`
2. Update `SimpleDispositif` interface in `@refugies-info/api-types` to include `origin: "RI" | "RCO"`
3. Verify all backend serializers include origin for both DTOs
4. Verify frontend search/filtering logic receives origin in `SimpleDispositif` objects
5. Test SSR and client-side fetches to confirm origin flows through both DTOs

**Alternatives Considered**:

- **Per-endpoint updates**: Error-prone; rejected in favor of centralized DTO
- **Feature flag per endpoint**: Unnecessary complexity; rejected

---

## Research Question 3: Safest Rollout Order & Fallback Behavior

**Question**: What sequence minimizes risk and how should clients handle missing origin?

### Decision: Staged Rollout with Graceful Degradation

**Rationale**:

- Shared types first ensures type safety across all consumers
- Backend changes before frontend ensures data is available
- Graceful fallback prevents UI crashes if origin is missing

**Rollout Sequence**:

#### Stage 1: Shared Types (Day 1)

1. Update `@refugies-info/api-types/src/modules/dispositif.ts`
   - Add `origin: "RI" | "RCO"` to `DispositifResponse` interface
   - Mark as required (non-optional) to enforce consistency
2. Publish updated types to monorepo
3. No breaking changes for existing consumers (origin defaults to `RI` server-side)

#### Stage 2: Backend Implementation (Day 1-2)

1. Update Mongoose schema in `apps/server/src/typegoose/Dispositif.ts`
   - Add `origin` field with enum and default
2. Update `DispositifAdapter` in `apps/server/src/modules/dispositif/`
   - Ensure origin is always serialized
3. Deploy server changes
4. Verify API responses include origin field

#### Stage 3: Frontend Updates (Day 2-3)

1. Update client-side types to match new DispositifResponse
2. Implement UI logic to display origin badges/treatments
3. Deploy frontend changes
4. Verify UI renders correctly with origin metadata

**Fallback Behavior for Missing Origin**:

```typescript
// In frontend components
const origin = dispositif.origin ?? "RI"; // Default to RI if missing
const isBadgeVisible = origin === "RCO"; // Only show badge for RCO
```

**Validation & Monitoring**:

- Alert if any API response lacks `origin` field (should never happen)
- Monitor error logs for serialization failures
- Verify 100% of responses include origin within 24 hours of deployment

**Alternatives Considered**:

- **Frontend-first rollout**: Risky; frontend would need to handle missing origin; rejected
- **All-at-once deployment**: Higher risk of cascading failures; rejected in favor of staged approach
- **Feature flag**: Unnecessary for this simple additive change; rejected

---

## Summary

| Unknown          | Decision                            | Risk Level | Confidence |
| ---------------- | ----------------------------------- | ---------- | ---------- |
| Schema migration | Lazy read-time default              | Low        | High       |
| API propagation  | Centralized DTO + adapter           | Low        | High       |
| Rollout order    | Staged (types → backend → frontend) | Low        | High       |

All unknowns resolved. Ready for Phase 1 design.
