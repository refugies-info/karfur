import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import { type ImageSchema, type ImageType, ImageZodSchema } from "./generics";
import type { ThemeId } from "./Theme";

// NeedTranslation Schema
export const NeedTranslationSchema = z.object({
  text: z.string(),
  subtitle: z.string(),
  updatedAt: z.date().optional(),
});
export type NeedTranslation = z.infer<typeof NeedTranslationSchema>;

const NeedTranslationMongooseSchema = new Schema<NeedTranslation>(
  {
    text: { type: String, required: true },
    subtitle: { type: String, required: true },
    updatedAt: { type: Date },
  },
  { _id: false },
);

// Need Schema
export const NeedSchema = z.object({
  tagName: z.string().optional(),
  theme: z.custom<ThemeId>(),
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

export type NeedType = z.infer<typeof NeedSchema> & { _id: Types.ObjectId };
export type NeedId = Types.ObjectId | string;

export interface Need extends Omit<NeedType, "theme" | "image"> {
  theme: ThemeId;
  image: ImageType;
}

export const NeedMongooseSchema = new Schema<Need>(
  {
    tagName: { type: String },
    theme: { type: Schema.Types.ObjectId, ref: "Theme", required: true },
    adminComments: { type: String },
    nbVues: { type: Number, default: 0 },
    position: {
      type: Number,
      validate: {
        validator: (v: unknown) => Number.isInteger(v) && Number(v) >= 0,
        message: "position must be a positive integer",
      },
    },
    image: { type: Schema.Types.Mixed, required: true }, // Using Mixed for now as ImageSchema is generic but usually embedded
    fr: { type: NeedTranslationMongooseSchema, required: true },
    ar: { type: NeedTranslationMongooseSchema, required: true },
    en: { type: NeedTranslationMongooseSchema, required: true },
    ru: { type: NeedTranslationMongooseSchema, required: true },
    fa: { type: NeedTranslationMongooseSchema, required: true },
    ti: { type: NeedTranslationMongooseSchema, required: true },
    ps: { type: NeedTranslationMongooseSchema, required: true },
    uk: { type: NeedTranslationMongooseSchema, required: true },
  },
  {
    collection: "needs",
    timestamps: { createdAt: "created_at" },
  },
);

export const NeedModel = model<Need>("Need", NeedMongooseSchema);
