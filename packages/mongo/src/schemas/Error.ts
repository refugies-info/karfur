import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { model, type Types } from "mongoose";
import { z } from "zod";

// Error Schema
export const ErrorSchema = z.object({
  name: z.string(),
  userId: zId("User").optional(),
  dataObject: z.record(z.unknown()),
  error: z.record(z.unknown()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Error = z.infer<typeof ErrorSchema> & Document;
export type ErrorId = Types.ObjectId;

export const ErrorMongooseSchema = zodSchema(ErrorSchema);
ErrorMongooseSchema.set("collection", "errors");
ErrorMongooseSchema.set("timestamps", true);

export const ErrorModel = model("Error", ErrorMongooseSchema);
