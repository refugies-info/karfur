import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
import { z } from "zod";

// Error Schema
export const ErrorSchema = z.object({
  name: z.string(),
  userId: zId("User").optional(),
  dataObject: z.record(z.any()),
  error: z.record(z.any()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Error = z.infer<typeof ErrorSchema> & Document<Types.ObjectId>;
/**
 * ErrorId represents a unique identifier for an Error.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Error` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type ErrorId = Types.ObjectId | string;

export const ErrorMongooseSchema = zodSchema(ErrorSchema);
ErrorMongooseSchema.set("collection", "errors");
ErrorMongooseSchema.set("timestamps", true);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const ErrorModel = (models.Error || model("Error", ErrorMongooseSchema)) as Model<Error>;
