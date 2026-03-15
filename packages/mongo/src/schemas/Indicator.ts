import type { Languages } from "@refugies-info/api-types";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
import { z } from "zod";

// Indicator Schema
export const IndicatorSchema = z.object({
  language: z.string() as z.ZodType<Languages>,
  wordsCount: z.number().int().positive(),
  dispositifId: zId("Dispositif"),
  userId: zId("User"),
  timeSpent: z.number().int().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Indicator = z.infer<typeof IndicatorSchema> & Document<Types.ObjectId>;
/**
 * IndicatorId represents a unique identifier for an Indicator.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Indicator` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type IndicatorId = Types.ObjectId | string;

export const IndicatorMongooseSchema = zodSchema(IndicatorSchema);
IndicatorMongooseSchema.set("collection", "indicators");
IndicatorMongooseSchema.set("timestamps", true);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const IndicatorModel = (models.Indicator ||
  model("Indicator", IndicatorMongooseSchema)) as Model<Indicator>;
