# API Contracts: Dispositif Origin Metadata

**Feature**: Dispositif Origin Metadata (RI-977)
**Date**: 2025-11-18
**Phase**: Phase 1 – API Contracts

---

## Overview

This document defines the REST API contracts for dispositif endpoints that now include the `origin` field. All changes are **additive** (backward-compatible).

---

## Shared DTOs: DispositifResponse & SimpleDispositif

### DispositifResponse (Full Details)

```typescript
// packages/api-types/src/modules/dispositif.ts
export interface DispositifResponse {
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
  // ... all other existing fields ...
}
```

### SimpleDispositif (Lightweight for Search/Lists)

```typescript
// packages/api-types/src/generics.ts
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

### Change Notes

- **New Field**: `origin: "RI" | "RCO"` (added to both DTOs)
- **Type**: Enum (string literal union)
- **Required**: Yes (always present)
- **Default**: `"RI"` (server-side)
- **Immutable**: Yes (cannot be changed via API)
- **Frontend Usage**: `SimpleDispositif` used in 83+ locations for search/filtering logic

---

## Endpoint Contracts

### 1. GET /api/dispositifs (List Dispositifs)

**Purpose**: Retrieve a paginated list of dispositifs (e.g., for catalogue/search)

**Request**:

```typescript
interface GetDispositifsRequest {
  type?: ContentType;
  locale: string;
  limit?: number;
  sort?: string;
  origin?: "RI" | "RCO";
}
```

**Response**:

```typescript
interface GetDispositifsResponse {
  data: DispositifResponse[];
  total: number;
  page: number;
  pageSize: number;
}
```

**Changes**:

- Each item in `data` now includes `origin` field
- No other changes to request/response structure

**Example**:

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "titreInformatif": "Aide au logement",
      "origin": "RI",
      ...
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "titreInformatif": "Formation professionnelle",
      "origin": "RCO",
      ...
    }
  ],
  "total": 2,
  "page": 1,
  "pageSize": 10
}
```

---

### 2. GET /api/dispositifs/:id (Get Single Dispositif)

**Purpose**: Retrieve a single dispositif by ID

**Request**:

```typescript
interface GetDispositifRequest {
  id: string; // Dispositif ID
}
```

**Response**:

```typescript
interface GetDispositifResponse extends DispositifResponse {
  // All fields including origin
}
```

**Changes**:

- Response now includes `origin` field
- No other changes

**Example**:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titreInformatif": "Aide au logement",
  "origin": "RI",
  ...
}
```

---

### 3. GET /api/dispositifs/search (Search Dispositifs)

**Purpose**: Search dispositifs with filters (themes, needs, etc.)

**Request**:

```typescript
interface SearchDispositifsRequest {
  query?: string;
  themeId?: string;
  needIds?: string[];
  locale: string;
  limit?: number;
  offset?: number;
  origin?: "RI" | "RCO";
}
```

**Response**:

```typescript
interface SearchDispositifsResponse {
  results: DispositifResponse[];
  total: number;
  facets?: {
    themes: { id: string; count: number }[];
    needs: { id: string; count: number }[];
  };
}
```

**Changes**:

- Each item in `results` now includes `origin` field
- No other changes to request/response structure

---

### 4. GET /api/user/favorites (Get User Favorites)

**Purpose**: Retrieve dispositifs marked as favorites by the authenticated user

**Request**:

```typescript
interface GetFavoritesRequest {
  userId: string;
  locale: string;
}
```

**Response**:

```typescript
interface GetFavoritesResponse {
  favorites: DispositifResponse[];
}
```

**Changes**:

- Each item in `favorites` now includes `origin` field

---

### 5. GET /api/dispositifs/count (Count Dispositifs)

**Purpose**: Get count of dispositifs matching criteria (used for search filters)

**Request**:

```typescript
interface CountDispositifsRequest {
  type: ContentType;
  publishedOnly: boolean;
  themeId?: string;
}
```

**Response**:

```typescript
interface CountDispositifsResponse {
  count: number;
}
```

**Changes**:

- No changes (this endpoint returns only count, not dispositif objects)

---

## Backward Compatibility

### For Existing Clients

1. **Clients that ignore new fields**: Will continue to work without modification
   - The `origin` field is additive
   - Existing field access remains unchanged

2. **Clients that need origin**: Can access it immediately after deployment

   ```typescript
   const origin = dispositif.origin; // "RI" or "RCO"
   ```

3. **Legacy documents**: Will return `origin: "RI"` by default
   - No breaking changes for existing data

### Version Strategy

- **No API versioning required** for this change
- Change is purely additive (no field removals or type changes)
- All existing clients continue to work

---

## Validation & Error Handling

### Server-Side Validation

1. **Invalid origin values**: Reject with 400 Bad Request

   ```json
   {
     "error": "Invalid origin value. Must be 'RI' or 'RCO'.",
     "code": "INVALID_ORIGIN"
   }
   ```

2. **Missing origin on creation**: Auto-default to `"RI"`
   - No error; transparent to client

3. **Attempt to update origin**: Reject with 400 Bad Request
   ```json
   {
     "error": "Origin field is immutable and cannot be changed.",
     "code": "IMMUTABLE_FIELD"
   }
   ```

---

## Frontend Type Updates

### TypeScript Types

```typescript
// apps/client/src/types/dispositif.ts
export interface Dispositif {
  _id: string;
  titreInformatif: string;
  origin: "RI" | "RCO"; // NEW
  // ... other fields ...
}

// Usage in components
const showBadge = dispositif.origin === "RCO";
```

### React Component Example

```typescript
// apps/client/src/components/DispositifCard.tsx
interface DispositifCardProps {
  dispositif: Dispositif;
}

export const DispositifCard: React.FC<DispositifCardProps> = ({ dispositif }) => {
  return (
    <div>
      <h3>{dispositif.titreInformatif}</h3>
      {dispositif.origin === "RCO" && (
        <span className="badge badge-experimental">AI-Assisted</span>
      )}
      {/* ... rest of component ... */}
    </div>
  );
};
```

---

## Summary

| Endpoint                    | Change                        | Breaking |
| --------------------------- | ----------------------------- | -------- |
| GET /api/dispositifs        | Add `origin` to each item     | No       |
| GET /api/dispositifs/:id    | Add `origin` to response      | No       |
| GET /api/dispositifs/search | Add `origin` to each result   | No       |
| GET /api/user/favorites     | Add `origin` to each favorite | No       |
| GET /api/dispositifs/count  | No change                     | No       |

All changes are **backward-compatible** and **additive**.
