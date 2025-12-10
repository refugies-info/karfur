import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
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

export type Need = z.infer<typeof NeedSchema> & Document;
export type NeedId = Types.ObjectId;

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

export const NeedModel = model("Need", NeedMongooseSchema);
