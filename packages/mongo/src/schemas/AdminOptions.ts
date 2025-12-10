import { model, Schema, type Types } from "mongoose";
import { z } from "zod";

// AdminOptions Schema
export const AdminOptionsSchema = z.object({
  key: z.string(),
  value: z.unknown(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AdminOptionsType = z.infer<typeof AdminOptionsSchema> & { _id: Types.ObjectId };
export type AdminOptionsId = Types.ObjectId | string;

export interface AdminOptions extends Omit<AdminOptionsType, "_id"> {
  _id: Types.ObjectId;
}

export const AdminOptionsMongooseSchema = new Schema<AdminOptions>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: "adminoptions",
    timestamps: { createdAt: "created_at" },
  },
);

export const AdminOptionsModel = model<AdminOptions>("AdminOptions", AdminOptionsMongooseSchema);
