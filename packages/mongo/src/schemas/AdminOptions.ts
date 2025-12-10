import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";

// AdminOptions Schema
export const AdminOptionsSchema = z.object({
  key: z.string(),
  value: z.unknown(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AdminOptionsType = z.infer<typeof AdminOptionsSchema>;
export type AdminOptionsId = Types.ObjectId | string;

export interface AdminOptions extends AdminOptionsType, Document {}

export const AdminOptionsMongooseSchema = zodSchema(AdminOptionsSchema);
AdminOptionsMongooseSchema.path("key").unique(true);
AdminOptionsMongooseSchema.set("collection", "adminoptions");
AdminOptionsMongooseSchema.set("timestamps", { createdAt: "created_at", updatedAt: "updatedAt" });

export const AdminOptionsModel = model<AdminOptions>(
  "AdminOptions",
  AdminOptionsMongooseSchema as unknown as Schema<AdminOptions>,
);
