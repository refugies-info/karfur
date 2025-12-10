// import type { DispositifId } from "../index"; // Not yet available
import { DispositifStatus } from "@refugies-info/api-types";
import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { StructureId } from "./Structure";
import type { UserId } from "./User";

// Needs strict imports or definitions if we want deep validation
// For now, we use unknown for complex nested types or simple object structures

export const SnapshotTypeEnum = z.enum(["before", "after"]);
export type SnapshotType = z.infer<typeof SnapshotTypeEnum>;

export const SnapshotSchema = z.object({
  dispositifId: z.custom<Types.ObjectId>(),
  version: z.number().min(1),
  created_at: z.date().optional(),
  type: SnapshotTypeEnum,
  from: z.nativeEnum(DispositifStatus),
  to: z.nativeEnum(DispositifStatus),
  data: z.record(z.unknown()), // DispositifContent | DemarcheContent
});

export type SnapshotTypeObj = z.infer<typeof SnapshotSchema> & { _id: Types.ObjectId };
export type SnapshotId = Types.ObjectId | string;

export interface Snapshot extends Omit<SnapshotTypeObj, "dispositifId"> {
  dispositifId: Types.ObjectId;
}

export const SnapshotMongooseSchema = new Schema<Snapshot>(
  {
    dispositifId: { type: Schema.Types.ObjectId, ref: "Dispositif", required: true },
    version: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ["before", "after"], required: true },
    from: { type: String, enum: Object.values(DispositifStatus), required: true },
    to: { type: String, enum: Object.values(DispositifStatus), required: true },
    data: { type: Object, required: true },
  },
  {
    collection: "snapshots",
    timestamps: { createdAt: "created_at" },
  },
);

export const SnapshotModel = model<Snapshot>("Snapshot", SnapshotMongooseSchema);
