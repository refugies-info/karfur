import type { Languages } from "@refugies-info/api-types";
import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
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

// TypeScript Interface inferred from Zod
export type LangueType = z.infer<typeof LangueZodSchema>;

// Mongoose Interface extending Document
export interface Langue extends Omit<LangueType, "i18nCode">, Document {
  _id: Types.ObjectId;
  i18nCode: Languages;
  created_at?: Date;
  updatedAt?: Date;
}

export type LangueId = Langue["_id"] | Langue["id"];

// Mongoose Schema
const LangueSchema = zodSchema(LangueZodSchema);
LangueSchema.path("langueFr").unique(true);
LangueSchema.path("i18nCode").unique(true);
LangueSchema.set("collection", "langues");
LangueSchema.set("timestamps", { createdAt: "created_at" });

export const LangueModel = model<Langue>("Langue", LangueSchema as unknown as Schema<Langue>);
