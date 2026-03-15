import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Schema, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";
import { ImageZodSchema } from "./generics";
import type { Langue } from "./Langue";

// Helper Zod Schemas
const TranslatedTextZodSchema = z.object({
  fr: z.string().optional(),
  ar: z.string().optional(),
  fa: z.string().optional(),
  ps: z.string().optional(),
  ti: z.string().optional(),
  so: z.string().optional(),
  am: z.string().optional(),
  uk: z.string().optional(),
  // Legacy languages still present on old content
  en: z.string().optional(),
  ru: z.string().optional(),
});

const ThemeColorsZodSchema = z.object({
  color100: z.string(),
  color80: z.string(),
  color60: z.string(),
  color40: z.string(),
  color30: z.string(),
});

const ThemeGradientColorsZodSchema = z.object({
  colorTop: z.string(),
  colorBottom: z.string(),
});

export const ThemeZodSchema = z.object({
  // NOTE: zod-mongoose does not correctly hydrate z.record(...) fields for Theme
  // (it resulted in `{}` at runtime for name/short in /themes responses).
  // We model translated text with explicit language keys to preserve data fidelity.
  name: TranslatedTextZodSchema,
  short: TranslatedTextZodSchema,
  mainColor: z.string(),
  colors: ThemeColorsZodSchema,
  gradientColors: ThemeGradientColorsZodSchema,
  position: z.number().int().nonnegative(),
  icon: ImageZodSchema.optional(),
  banner: ImageZodSchema.optional(),
  appBanner: ImageZodSchema.optional(),
  appImage: ImageZodSchema.optional(),
  shareImage: ImageZodSchema.optional(),
  dispositifImage: ImageZodSchema.optional(),
  demarcheImage: ImageZodSchema.optional(),
  notificationEmoji: z.string(),
  adminComments: z.string().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ThemeType = z.infer<typeof ThemeZodSchema>;

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

// Interface

// Interface
export type Theme = z.infer<typeof ThemeZodSchema> &
  Document<Types.ObjectId> & {
    // Methods
    isActive(activeLanguages: Langue[]): boolean;
  };

/**
 * ThemeId represents a unique identifier for a Theme.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Theme` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type ThemeId = Theme["_id"] | string;

// Schema
const ThemeMongooseSchema = zodSchema(ThemeZodSchema);
ThemeMongooseSchema.set("collection", "themes");
ThemeMongooseSchema.set("timestamps", { createdAt: "created_at" });

// Disable _id for subdocuments
const subdocPaths = [
  "colors",
  "gradientColors",
  "icon",
  "banner",
  "appBanner",
  "appImage",
  "shareImage",
  "dispositifImage",
  "demarcheImage",
];
for (const path of subdocPaths) {
  const p = ThemeMongooseSchema.path(path) as any;
  if (p && p.schema) {
    p.schema.set("_id", false);
  }
}

// Method implementation
ThemeMongooseSchema.methods.isActive = function (this: Theme, activeLanguages: Langue[]): boolean {
  // titles
  for (const ln of activeLanguages) {
    if (!this.name?.[ln.i18nCode] || !this.short?.[ln.i18nCode]) return false;
  }

  if (
    // colors
    !this.colors?.color100 ||
    !this.colors?.color80 ||
    !this.colors?.color60 ||
    !this.colors?.color40 ||
    !this.colors?.color30 ||
    // images
    !this.icon?.secure_url ||
    !this.banner?.secure_url ||
    !this.appImage?.secure_url ||
    !this.shareImage?.secure_url ||
    !this.dispositifImage?.secure_url ||
    !this.demarcheImage?.secure_url ||
    !this.notificationEmoji
  ) {
    return false;
  }
  return true;
};

ThemeMongooseSchema.plugin(SpeedGooseCacheAutoCleaner);

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const ThemeModel = (models.Theme ||
  model("Theme", ThemeMongooseSchema as unknown as Schema<Theme>)) as Model<Theme>;
