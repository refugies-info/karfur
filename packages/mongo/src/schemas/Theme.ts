import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { SpeedGooseCacheAutoCleaner } from "speedgoose";
import { z } from "zod";
import { ImageZodSchema } from "./generics";
import type { Langue } from "./Langue";

// Helper Zod Schemas
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
  name: z.record(z.string()),
  short: z.record(z.string()),
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

export const ThemeModel = model<Theme>("Theme", ThemeMongooseSchema as unknown as Schema<Theme>);
