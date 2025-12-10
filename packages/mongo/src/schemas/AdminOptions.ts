import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

// AdminOptions Schema
export const AdminOptionsSchema = z.object({
  key: z.string(),
  value: z.unknown(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AdminOptions = z.infer<typeof AdminOptionsSchema> & Document;

export const AdminOptionsMongooseSchema = zodSchema(AdminOptionsSchema);
AdminOptionsMongooseSchema.path("key").unique(true);
AdminOptionsMongooseSchema.set("collection", "adminoptions");
AdminOptionsMongooseSchema.set("timestamps", { createdAt: "created_at", updatedAt: "updatedAt" });

export const AdminOptionsModel = model("AdminOptions", AdminOptionsMongooseSchema);
