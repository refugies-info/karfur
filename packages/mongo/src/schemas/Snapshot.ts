import { DispositifStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

// Needs strict imports or definitions if we want deep validation
// For now, we use unknown for complex nested types or simple object structures

export const SnapshotTypeEnum = z.enum(["before", "after"]);
export type SnapshotType = z.infer<typeof SnapshotTypeEnum>;

export const SnapshotSchema = z.object({
  dispositifId: zId("Dispositif"),
  version: z.number().min(1),
  created_at: z.date().optional(),
  type: SnapshotTypeEnum,
  from: z.enum(
    Object.values(DispositifStatus) as [string, ...string[]],
  ) as z.ZodType<DispositifStatus>,
  to: z.enum(
    Object.values(DispositifStatus) as [string, ...string[]],
  ) as z.ZodType<DispositifStatus>,
  // PATCHED: z.record becomes Map, but we want Mixed (POJO) to match existing behavior/tests
  data: z.any(),
});

// --- Strict TypeScript types ---
type SnapshotBase = z.infer<typeof SnapshotSchema>;

// Patched type
export type Snapshot = Omit<SnapshotBase, "data"> & {
  data: Record<string, any>;
} & Document<Types.ObjectId>;
/**
 * SnapshotId represents a unique identifier for a Snapshot.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Snapshot` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type SnapshotId = Types.ObjectId | string;

export const SnapshotMongooseSchema = zodSchema(SnapshotSchema);
SnapshotMongooseSchema.set("collection", "snapshots");
SnapshotMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const SnapshotModel = model("Snapshot", SnapshotMongooseSchema);
