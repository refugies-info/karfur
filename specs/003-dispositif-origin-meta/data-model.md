# Data Model: Dispositif Origin Metadata

**Feature**: Dispositif Origin Metadata (RI-977)
**Date**: 2025-11-18
**Phase**: Phase 1 – Design & Data Model

---

## Entity: Dispositif (Enhanced)

### Core Addition

**Field**: `origin`
**Type**: Enum
**Values**: `"RI"` | `"RCO"`
**Default**: `"RI"`
**Immutable**: Yes (cannot be changed after creation)
**Required**: Yes (always present in stored documents)

### Field Semantics

- **`RI`**: Dispositif originates from the current editorial process (Réfugiés.info team)
- **`RCO`**: Dispositif originates from the AI-assisted creation pipeline (future feature)

### Mongoose Schema Definition

```typescript
// apps/server/src/typegoose/Dispositif.ts
import { prop, getModelForClass } from "@typegoose/typegoose";

export class Dispositif {
  // ... existing fields ...

  @prop({
    enum: ["RI", "RCO"],
    default: "RI",
    required: true,
    immutable: true,
  })
  origin!: "RI" | "RCO";

  // ... rest of fields ...
}

export const DispositifModel = getModelForClass(Dispositif);
```

### Validation Rules

1. **On Creation**: `origin` must be explicitly provided or defaults to `"RI"`
2. **On Update**: `origin` field cannot be modified (immutable)
3. **On Query**: Missing `origin` field (legacy documents) treated as `"RI"` at serialization time
4. **On Validation**: Reject any value outside `["RI", "RCO"]` with error message: "Origin must be either 'RI' or 'RCO'"

### State Transitions

```
Document Lifecycle:
┌─────────────────────────────────────────┐
│ Create Dispositif                       │
│ - origin set to "RI" (default)          │
│ - or origin explicitly set to "RCO"     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Published / Draft / Archived            │
│ - origin IMMUTABLE throughout lifecycle │
│ - cannot change origin on status change │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ Deleted                                 │
│ - origin preserved in soft-delete       │
│ - if hard-delete, origin lost           │
└─────────────────────────────────────────┘
```

---

## API Response DTOs: DispositifResponse & SimpleDispositif (Enhanced)

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

**Usage**: `SimpleDispositif` is used extensively in frontend search/filtering logic (83+ matches across client components)

### Serialization Strategy

**Current Approach**: Serialization happens inline in repository functions (`getSimpleDispositifs`, `getStructureDispositifs`) using lodash utilities (`pick`, `omit`, spread operators).

**For Origin Field**:

1. **Minimal Change (Current Approach)**: Add `origin: dispositif.origin ?? "RI"` to the inline serialization in each repository function
2. **Recommended Refactoring**: Extract serialization logic into dedicated functions for clarity and testability

#### Option 1: Minimal Change (Recommended for this spec)

Update `getSimpleDispositifs` in `dispositif.repository.ts`:

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

Same pattern for `getStructureDispositifs`.

#### Option 2: Future Refactoring (Out of Scope)

Create dedicated serializer functions for clarity:

```typescript
// apps/server/src/modules/dispositif/dispositif.serializers.ts
export const serializeSimpleDispositif = (dispositif: Dispositif, locale: Languages): SimpleDispositif => {
  const translation = dispositif.translations[locale] || dispositif.translations.fr;
  return {
    _id: dispositif._id,
    titreInformatif: translation.content.titreInformatif,
    // ... other fields ...
    origin: dispositif.origin ?? "RI",
  };
};
```

**Recommendation**: Use Option 1 for this spec (minimal, focused change). Option 2 could be a future tech debt task for improving code clarity and testability across all serialization points.

**Key Points**:

- Always include `origin` in response (never omit)
- Default to `"RI"` if missing (backward compatibility)
- Immutability enforced at database layer, not API layer

---

## Relationships & Dependencies

### No New Relationships

The `origin` field is purely metadata; it does not introduce new relationships:

- No foreign keys to new collections
- No new indexes required (can be added later if filtering by origin becomes common)
- No cascading effects on related entities (themes, needs, sponsors, etc.)

### Backward Compatibility

- Existing queries continue to work without modification
- Existing documents without `origin` field are treated as `"RI"` during serialization
- No migration required; lazy default approach

---

## Lifecycle & Immutability

### Why Immutable?

Immutability ensures provenance integrity:

1. **Audit trail**: Origin cannot be falsified after creation
2. **Compliance**: Regulatory/legal requirement to track content source
3. **Data integrity**: Prevents accidental or malicious origin changes

### Enforcement

- **Database layer**: Mongoose `immutable: true` prevents updates
- **Application layer**: Service layer should reject any update attempts to `origin`
- **API layer**: No endpoint exposes origin update capability

### Edge Cases

1. **Dispositif Duplication**: If a dispositif is duplicated, the copy inherits the same origin as the original
2. **Dispositif Archival**: Origin remains unchanged when status changes to ARCHIVED
3. **Dispositif Deletion**: Origin is preserved in soft-delete; lost in hard-delete

---

## Migration & Backfill Strategy

### Migration Required

**Approach**: Proactive backfill migration (see `tasks.md` T004a, T004b)

1. **Migration Creation**: Use `pnpm migrate new --name backfill-origin-ri` to generate migration file
2. **Backfill Logic**: Set `origin: "RI"` for all existing documents in `dispositifs` collection
3. **Execution**: Run migration before importing any `origin: "RCO"` content
4. **Verification**: Ensure all documents have `origin` field explicitly set

### Migration Implementation

```typescript
// migrations/<timestamp>_backfill-origin-ri.ts
export async function up(db: Db): Promise<void> {
  const result = await db
    .collection("dispositifs")
    .updateMany({ origin: { $exists: false } }, { $set: { origin: "RI" } });
  console.log(`Backfilled ${result.modifiedCount} dispositifs with origin: RI`);
}

export async function down(db: Db): Promise<void> {
  // Optional: Remove origin field for rollback
  await db.collection("dispositifs").updateMany({ origin: "RI" }, { $unset: { origin: "" } });
}
```

---

## Summary

| Aspect                  | Details                      |
| ----------------------- | ---------------------------- |
| **New Field**           | `origin: "RI" \| "RCO"`      |
| **Type**                | Enum                         |
| **Default**             | `"RI"`                       |
| **Immutable**           | Yes                          |
| **Indexed**             | No (can add later)           |
| **Backward Compatible** | Yes (with migration)         |
| **Migration Required**  | Yes (backfill existing docs) |
| **New Relationships**   | None                         |
| **Breaking Changes**    | None                         |
