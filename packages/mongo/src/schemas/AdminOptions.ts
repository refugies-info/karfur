import { zodSchema } from "@zodyac/zod-mongoose";
import { model, type Schema, type Types } from "mongoose";
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

export const AdminOptionsMongooseSchema = zodSchema(AdminOptionsSchema);
AdminOptionsMongooseSchema.path("key").unique(true);
AdminOptionsMongooseSchema.set("collection", "adminoptions");
AdminOptionsMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const AdminOptionsModel = model<AdminOptions>(
  "AdminOptions",
  AdminOptionsMongooseSchema as unknown as Schema<AdminOptions>,
);
