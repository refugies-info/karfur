import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";

// AdminOptions Schema
export const AdminOptionsSchema = z.object({
  key: z.string(),
  value: z.any(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AdminOptions = z.infer<typeof AdminOptionsSchema> & Document<Types.ObjectId>;

export const AdminOptionsMongooseSchema = zodSchema(AdminOptionsSchema);
AdminOptionsMongooseSchema.path("key").unique(true);
AdminOptionsMongooseSchema.set("collection", "adminoptions");
AdminOptionsMongooseSchema.set("timestamps", { createdAt: "created_at", updatedAt: "updatedAt" });

AdminOptionsMongooseSchema.plugin(SpeedGooseCacheAutoCleaner);

export const AdminOptionsModel = model("AdminOptions", AdminOptionsMongooseSchema);
