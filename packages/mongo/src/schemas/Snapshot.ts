import { DispositifStatus } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import type { StructureId } from "./Structure";
import type { UserId } from "./User";

// Needs strict imports or definitions if we want deep validation
// For now, we use unknown for complex nested types or simple object structures

export const SnapshotTypeEnum = z.enum(["before", "after"]);
export type SnapshotType = z.infer<typeof SnapshotTypeEnum>;

export const SnapshotSchema = z.object({
  dispositifId: zId("Dispositif"),
  version: z.number().min(1),
  created_at: z.date().optional(),
  type: SnapshotTypeEnum,
  from: z.nativeEnum(DispositifStatus),
  to: z.nativeEnum(DispositifStatus),
  data: z.record(z.unknown()), // DispositifContent | DemarcheContent
});

export type SnapshotTypeObj = z.infer<typeof SnapshotSchema> & { _id: Types.ObjectId };
export type SnapshotId = Types.ObjectId | string;

export interface Snapshot extends Omit<SnapshotTypeObj, "_id" | "dispositifId">, Document {
  dispositifId: Types.ObjectId;
}

export const SnapshotMongooseSchema = zodSchema(SnapshotSchema);
SnapshotMongooseSchema.set("collection", "snapshots");
SnapshotMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const SnapshotModel = model<Snapshot>(
  "Snapshot",
  SnapshotMongooseSchema as unknown as Schema<Snapshot>,
);
