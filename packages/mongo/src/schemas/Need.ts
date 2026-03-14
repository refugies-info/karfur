import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";
import { ImageZodSchema } from "./generics";

// NeedTranslation Schema
export const NeedTranslationSchema = z.object({
  text: z.string(),
  subtitle: z.string(),
  updatedAt: z.date().optional(),
});
export type NeedTranslation = z.infer<typeof NeedTranslationSchema>;

// Need Schema
export const NeedSchema = z.object({
  tagName: z.string().optional(),
  theme: zId("Theme"),
  adminComments: z.string().optional(),
  nbVues: z.number().default(0),
  position: z.number().int().min(0).optional(),
  image: ImageZodSchema,
  fr: NeedTranslationSchema,
  ar: NeedTranslationSchema,
  en: NeedTranslationSchema,
  ru: NeedTranslationSchema,
  fa: NeedTranslationSchema,
  ti: NeedTranslationSchema,
  ps: NeedTranslationSchema,
  uk: NeedTranslationSchema,
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Need = z.infer<typeof NeedSchema> & Document<Types.ObjectId>;
/**
 * NeedId represents a unique identifier for a Need.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Need` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type NeedId = Types.ObjectId | string;

export const NeedMongooseSchema = zodSchema(NeedSchema);
NeedMongooseSchema.set("collection", "needs");
NeedMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Disable _id for subdocuments
const subdocPaths = ["fr", "ar", "en", "ru", "fa", "ti", "ps", "uk", "image"];
for (const path of subdocPaths) {
  const p = NeedMongooseSchema.path(path) as any;
  if (p && p.schema) {
    p.schema.set("_id", false);
  }
}

NeedMongooseSchema.plugin(SpeedGooseCacheAutoCleaner);

export const NeedModel = model("Need", NeedMongooseSchema);
