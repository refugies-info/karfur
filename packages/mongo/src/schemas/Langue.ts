import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

// Zod Schema
export const LangueZodSchema = z.object({
  langueFr: z.string(),
  langueLoc: z.string().optional(),
  langueCode: z.string().optional(),
  i18nCode: z.enum(["fr", "en", "uk", "ti", "ar", "ps", "ru", "fa"]),
  avancement: z.number().default(0),
  avancementTrad: z.number().default(0),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

// TypeScript Interface inferred from Zod + Mongoose Document
export type Langue = z.infer<typeof LangueZodSchema> & Document<Types.ObjectId>;
/**
 * LangueId represents a unique identifier for a Langue.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Langue` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type LangueId = Langue["_id"] | string;

// Mongoose Schema
const LangueSchema = zodSchema(LangueZodSchema);
LangueSchema.path("langueFr").unique(true);
LangueSchema.path("i18nCode").unique(true);
LangueSchema.set("collection", "langues");
LangueSchema.set("timestamps", { createdAt: "created_at" });

export const LangueModel = model("Langue", LangueSchema);
