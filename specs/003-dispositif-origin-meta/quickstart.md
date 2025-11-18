# Quickstart: Dispositif Origin Metadata Implementation

**Feature**: Dispositif Origin Metadata (RI-977)
**Date**: 2025-11-18
**Phase**: Phase 1 – Implementation Quickstart

---

## Overview

This guide walks through the implementation of the `origin` metadata field for dispositifs. Follow the **staged rollout** approach outlined in `research.md`.

---

## Stage 1: Shared Types (Day 1)

### Step 1.1: Update DispositifResponse Interface

**File**: `packages/api-types/src/modules/dispositif.ts`

```typescript
// Add to DispositifResponse interface
export interface DispositifResponse {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  theme: Id;
  secondaryThemes: Id[];
  needs: Id[];
  status: DispositifStatus;
  origin: "RI" | "RCO"; // NEW FIELD - add here
  nbVues: number;
  nbVuesMobile: number;
  typeContenu: ContentType;
  sponsorUrl: string;
  // ... rest of fields ...
}
```

### Step 1.2: Update SimpleDispositif Interface

**File**: `packages/api-types/src/generics.ts`

Add `origin` field to `SimpleDispositif` (used extensively in frontend search/filtering):

```typescript
export interface SimpleDispositif {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: ContentType;
  status: DispositifStatus;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas?: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  nbVuesMobile: number;
  sponsor?: { nom: string; picture?: Picture };
  availableLanguages: string[];
  hasDraftVersion: boolean;
  themeSortIndex: number;
  origin: "RI" | "RCO"; // NEW FIELD
}
```

### Step 1.3: Verify Type Exports

Ensure both DTOs are exported from the main index:

```typescript
// packages/api-types/src/index.ts
export { DispositifResponse } from "./modules/dispositif";
export { SimpleDispositif } from "./generics";
```

### Step 1.4: Test Type Compilation

```bash
cd /Users/luis/Code/refugies_info/karfur
pnpm check:types
```

**Expected**: No type errors.

---

## Stage 2: Backend Implementation (Day 1-2)

### Step 2.1: Update Mongoose Schema

**File**: `apps/server/src/typegoose/Dispositif.ts`

```typescript
import { prop, getModelForClass } from "@typegoose/typegoose";

export class Dispositif {
  // ... existing fields ...

  @prop({
    enum: ["RI", "RCO"],
    default: "RI",
    required: true,
    immutable: true, // Prevent updates
  })
  origin!: "RI" | "RCO";

  // ... rest of fields ...
}

export const DispositifModel = getModelForClass(Dispositif);
```

### Step 2.2: Update Serialization in Repository Functions

**File**: `apps/server/src/modules/dispositif/dispositif.repository.ts`

**Status**: Serialization happens inline in repository functions using lodash utilities. Add origin field to each serialization point.

**Changes Required**:

1. **In `getSimpleDispositifs()` function** (line ~130-154):

   ```typescript
   const resDisp = {
     _id: dispositif._id,
     ...pick(translation.content, ["titreInformatif", "titreMarque", "abstract"]),
     metadatas: dispositif.metadatas,
     ...omit(dispositif, ["translations", "mainSponsor"]),
     availableLanguages: Object.keys(dispositif.translations),
     hasDraftVersion: dispositif.hasDraftVersion,
     themeSortIndex: dispositif.sortThemeIndex,
     origin: dispositif.origin ?? "RI", // NEW: Add origin with fallback
     sponsor: null as Partial<typeof dispositif.mainSponsor>,
   };
   ```

2. **In `getStructureDispositifs()` function** (line ~204-236):
   ```typescript
   const resDisp = {
     _id: dispositif._id,
     ...pick(translation.content, ["titreInformatif", "titreMarque", "abstract"]),
     metadatas: dispositif.metadatas,
     ...omit(dispositif, ["translations", "merci", "mainSponsor"]),
     availableLanguages: Object.keys(dispositif.translations),
     hasDraftVersion: dispositif.hasDraftVersion,
     nbMercis: dispositif.merci.length,
     suggestions,
     themeSortIndex: dispositif.sortThemeIndex,
     origin: dispositif.origin ?? "RI", // NEW: Add origin with fallback
     sponsor: null as Partial<typeof dispositif.mainSponsor>,
   };
   ```

**Note**: This is a minimal, focused change. Future refactoring could extract serialization into dedicated functions for clarity and testability (see `data-model.md` for details).

### Step 2.3: Evaluate Service Layer Impact

**File**: `apps/server/src/modules/dispositif/dispositif.service.ts`

**Analysis**: The service layer handles dispositif lifecycle operations (create, update, publish, delete). The `origin` field is immutable after creation, so:

**Changes Required**:

1. In `buildNewDispositif()` function: Add origin field handling for new dispositifs

   ```typescript
   export const buildNewDispositif = async (
     formContent: UpdateDispositifRequest | CreateDispositifRequest,
     userId: string,
   ): Promise<Partial<Dispositif>> => {
     const editedDispositif: Partial<Dispositif> = {};

     // NEW: Set origin for new dispositifs (defaults to RI)
     if ("origin" in formContent && formContent.origin) {
       editedDispositif.origin = formContent.origin; // "RI" or "RCO"
     } else {
       editedDispositif.origin = "RI"; // Default
     }

     // ... rest of existing logic ...
   };
   ```

2. In `saveAndOverwriteDraft()` function: Ensure origin is NOT overwritten when merging draft

   ```typescript
   // When copying fields from draft to published version:
   // DO NOT include: dispositifToSave.origin = draftDispositif.origin;
   // Origin must remain immutable from creation
   ```

3. No changes needed to:
   - `publishDispositif()` - doesn't modify origin
   - `deleteDispositifInDb()` - origin preserved on deletion
   - `isDispositifComplete()` - origin not part of completeness check
   - Other utility functions

**Verification**: Add test to ensure origin cannot be changed after creation.

### Step 2.4: Test Backend Changes

#### Unit Test: Schema Validation

```typescript
// apps/server/src/modules/dispositif/__tests__/dispositif.schema.test.ts
describe("Dispositif Schema - Origin Field", () => {
  it("should set default origin to RI", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      // origin not provided
    });
    expect(doc.origin).toBe("RI");
  });

  it("should accept RCO origin", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      origin: "RCO",
    });
    expect(doc.origin).toBe("RCO");
  });

  it("should reject invalid origin", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      origin: "INVALID",
    });
    expect(() => doc.validate()).toThrow();
  });

  it("should prevent origin updates", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      origin: "RI",
    });
    doc.origin = "RCO";
    expect(() => doc.validate()).toThrow(); // immutable
  });
});
```

#### Integration Test: API Response

```typescript
// apps/server/src/modules/dispositif/__tests__/dispositif.adapter.test.ts
describe("DispositifAdapter - Origin Serialization", () => {
  it("should include origin in serialized response", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      origin: "RI",
    });
    const response = serializeDispositif(doc);
    expect(response.origin).toBe("RI");
  });

  it("should default missing origin to RI", async () => {
    const doc = new DispositifModel({
      titreInformatif: "Test",
      // origin not set (legacy doc)
    });
    const response = serializeDispositif(doc);
    expect(response.origin).toBe("RI");
  });
});
```

### Step 2.5: Add Service Layer Tests

**File**: `apps/server/src/modules/dispositif/__tests__/dispositif.service.test.ts`

```typescript
describe("Dispositif Service - Origin Field", () => {
  it("should set origin to RI by default in buildNewDispositif", async () => {
    const formContent = {
      mainSponsor: "123",
      theme: "456",
      // origin not provided
    };
    const result = await buildNewDispositif(formContent, "userId");
    expect(result.origin).toBe("RI");
  });

  it("should accept RCO origin in buildNewDispositif", async () => {
    const formContent = {
      mainSponsor: "123",
      theme: "456",
      origin: "RCO",
    };
    const result = await buildNewDispositif(formContent, "userId");
    expect(result.origin).toBe("RCO");
  });

  it("should not overwrite origin when saving draft", async () => {
    // Create dispositif with origin RI
    const dispositif = await createDispositif({ origin: "RI" });

    // Save draft with different origin (should be ignored)
    const draft = { origin: "RCO" };
    const result = await saveAndOverwriteDraft(dispositif._id, draft);

    // Origin should remain RI
    expect(result.updatedDispositif.origin).toBe("RI");
  });
});
```

### Step 2.6: Deploy Backend

```bash
cd /Users/luis/Code/refugies_info/karfur
pnpm build:server
# Deploy to staging/production
```

**Verification**:

- API responses include `origin` field
- All dispositifs return `origin: "RI"` (default)
- No errors in server logs

---

## Stage 3: Frontend Updates (Day 2-3)

### Step 3.1: Update CreateDispositifRequest & UpdateDispositifRequest Types

**File**: `packages/api-types/src/modules/dispositif.ts`

Add `origin` field to request interfaces (optional, defaults to RI on backend):

```typescript
export interface CreateDispositifRequest extends DispositifRequest {
  origin?: "RI" | "RCO"; // Optional; defaults to RI on backend
  // ... other fields ...
}

export interface UpdateDispositifRequest {
  origin?: "RI" | "RCO"; // Optional; will be ignored if provided (immutable)
  // ... other fields ...
}
```

### Step 3.2: Update Client Types

**File**: `apps/client/src/types/dispositif.ts` (or similar)

```typescript
export interface Dispositif {
  _id: string;
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  theme: Id;
  secondaryThemes: Id[];
  needs: Id[];
  status: DispositifStatus;
  origin: "RI" | "RCO"; // NEW FIELD
  nbVues: number;
  nbVuesMobile: number;
  typeContenu: ContentType;
  sponsorUrl: string;
  // ... other fields ...
}
```

### Step 3.3: Update SSR Data Fetching

**File**: `apps/client/src/pages/recherche.tsx` (search page)

```typescript
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  // Fetch dispositifs (now includes origin)
  const response = await fetch(`/api/dispositifs?locale=${locale}`);
  const { data: dispositifs } = await response.json();

  return {
    props: {
      dispositifs, // Now includes origin field
    },
  };
};

export default function RechercheePage({ dispositifs }: Props) {
  return (
    <div>
      {dispositifs.map((dispositif) => (
        <DispositifCard key={dispositif._id} dispositif={dispositif} />
      ))}
    </div>
  );
}
```

### Step 3.4: Test Frontend Changes

#### Integration Test: SSR Data

```typescript
// apps/client/src/pages/__tests__/recherche.test.tsx
import { getServerSideProps } from "../recherche";

describe("Recherche Page - Origin Metadata", () => {
  it("should include origin in SSR props", async () => {
    const context = { locale: "fr" };
    const props = await getServerSideProps(context);

    expect(props.props.dispositifs).toBeDefined();
    expect(props.props.dispositifs[0]).toHaveProperty("origin");
    expect(["RI", "RCO"]).toContain(props.props.dispositifs[0].origin);
  });
});
```

### Step 3.5: Deploy Frontend

```bash
cd /Users/luis/Code/refugies_info/karfur
pnpm build:client
# Deploy to staging/production
```

**Verification**:

- UI renders without errors
- Origin badges display correctly for RCO items
- No console errors or type warnings

---

## Validation & Monitoring

### Post-Deployment Checklist

- [ ] All API responses include `origin` field (100%)
- [ ] No validation errors in server logs
- [ ] Frontend renders without errors
- [ ] Origin badges display correctly for RCO items
- [ ] SSR data includes origin field
- [ ] No type errors in TypeScript compilation
- [ ] Tests pass (unit + integration)

### Monitoring Queries

#### Check API Response Completeness

```bash
# Query a few dispositifs and verify origin is present
curl -s http://localhost:3000/api/dispositifs?locale=fr | jq '.data[0].origin'
# Expected: "RI" or "RCO"
```

#### Check Database State

```javascript
// MongoDB query to verify origin field
db.dispositifs.find({ origin: { $exists: false } }).count();
// Expected: 0 (or count of legacy docs, which will default to RI on read)
```

#### Monitor Error Logs

```bash
# Check for validation errors
grep -i "origin" /var/log/app.log | grep -i error
# Expected: No errors
```

---

## Rollback Plan

If issues arise:

1. **Frontend Rollback**: Revert client deployment (origin field is optional in UI)
2. **Backend Rollback**: Revert server deployment (schema change is backward-compatible)
3. **Type Rollback**: Revert `@refugies-info/api-types` (clients can ignore new field)

No data loss or migration issues expected.

---

## Summary

| Stage       | Duration  | Key Tasks                 | Verification                 |
| ----------- | --------- | ------------------------- | ---------------------------- |
| 1: Types    | 1 hour    | Update DispositifResponse | Type compilation passes      |
| 2: Backend  | 4-8 hours | Schema + adapter + tests  | API responses include origin |
| 3: Frontend | 4-8 hours | Components + SSR + tests  | UI renders correctly         |

**Total**: ~1-2 days for full implementation.
