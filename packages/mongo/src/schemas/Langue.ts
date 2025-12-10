import type { Languages } from "@refugies-info/api-types";
import { type Document, model, Schema, type Types } from "mongoose";
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
const LangueSchema = new Schema<Langue>(
  {
    langueFr: { type: String, required: true, unique: true },
    langueLoc: { type: String },
    langueCode: { type: String },
    i18nCode: { type: String, required: true, unique: true },
    avancement: { type: Number, default: 0 },
    avancementTrad: { type: Number, default: 0 },
  },
  {
    collection: "langues",
    timestamps: { createdAt: "created_at" },
  },
);

export const LangueModel = model<Langue>("Langue", LangueSchema);
