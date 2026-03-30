import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type FlattenMaps, type Model, model, models, type Types } from "mongoose";
import { z } from "zod";

export enum TraductionsType {
  SUGGESTION = "suggestion",
  VALIDATION = "validation",
}

export enum TraductionsStatus {
  VALIDATED = "VALIDATED",
  TO_REVIEW = "TO_REVIEW",
  PENDING = "PENDING",
  TO_TRANSLATE = "TO_TRANSLATE",
}

export const TraductionDiffSchema = z.object({
  added: z.array(z.string()),
  modified: z.array(z.string()),
  removed: z.array(z.string()),
});
export type TraductionDiff = z.infer<typeof TraductionDiffSchema>;

export const TraductionsZodSchema = z.object({
  dispositifId: zId("Dispositif"),
  userId: zId("User"),
  language: z.enum(["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"]),
  translated: z.record(z.any()), // Partial<TranslationContent> is complex, using generic object
  timeSpent: z.number().optional(),
  finished: z.boolean().optional(),
  toReview: z.array(z.string()).optional(),
  toReviewCache: z.array(z.string()).optional(),
  toFinish: z.array(z.string()).optional(),
  type: z.enum(Object.values(TraductionsType) as [string, ...string[]]).optional() as z.ZodType<
    TraductionsType | undefined
  >,
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Traductions = z.infer<typeof TraductionsZodSchema> & Document<Types.ObjectId>;
export type LeanTraductions = FlattenMaps<Traductions> & Required<{ _id: Types.ObjectId }>;
/**
 * TraductionId represents a unique identifier for a Traduction.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Traductions` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type TraductionId = Types.ObjectId | string;

const TraductionsMongooseSchema = zodSchema(TraductionsZodSchema);
TraductionsMongooseSchema.set("collection", "traductions");
TraductionsMongooseSchema.set("timestamps", { createdAt: "created_at" });

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const TraductionsModel = (models.Traductions ||
  model("Traductions", TraductionsMongooseSchema)) as Model<Traductions>;
