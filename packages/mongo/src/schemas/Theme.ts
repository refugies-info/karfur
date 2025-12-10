import type { ThemeGradientColors } from "@refugies-info/api-types";
import { type Document, model, Schema, type Types } from "mongoose";
import { z } from "zod";
import { type Image, ImageSchema } from "./generics";
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

// Theme Zod Schema
export const ThemeZodSchema = z.object({
  name: z.record(z.string()),
  short: z.record(z.string()),
  mainColor: z.string(),
  colors: ThemeColorsZodSchema,
  gradientColors: ThemeGradientColorsZodSchema,
  position: z.number().int().nonnegative(),
  icon: ImageSchema.obj ? z.any() : z.any(), // Zod validation for subdoc is tricky if reusing mongoose schema object, defining separate type is better. We used ImageZodSchema in generics?
  banner: ImageSchema.obj ? z.any() : z.any(),
  appBanner: ImageSchema.obj ? z.any() : z.any(),
  appImage: ImageSchema.obj ? z.any() : z.any(),
  shareImage: ImageSchema.obj ? z.any() : z.any(),
  dispositifImage: ImageSchema.obj ? z.any() : z.any(),
  demarcheImage: ImageSchema.obj ? z.any() : z.any(),
  notificationEmoji: z.string(),
  adminComments: z.string().optional(),
});

// Note: Zod schema above has 'any' for images because we are mixing approaches.
// Let's import ImageZodSchema properly.

import { ImageZodSchema } from "./generics";

export const ThemeZodSchemaFinal = z.object({
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

export type ThemeType = z.infer<typeof ThemeZodSchemaFinal>;

export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}

// Interface
export interface Theme extends Document {
  _id: Types.ObjectId;
  name: Record<string, string>;
  short: Record<string, string>;
  mainColor: string;
  colors: ThemeColors;
  gradientColors: ThemeGradientColors;
  position: number;
  icon?: Image;
  banner?: Image;
  appBanner?: Image;
  appImage?: Image;
  shareImage?: Image;
  dispositifImage?: Image;
  demarcheImage?: Image;
  notificationEmoji: string;
  adminComments?: string;
  created_at?: Date;
  updatedAt?: Date;

  // Methods
  isActive(activeLanguages: Langue[]): boolean;
}

export type ThemeId = Theme["_id"] | Theme["id"];

// Schema
const ThemeSchema = new Schema<Theme>(
  {
    name: { type: Map, of: String },
    short: { type: Map, of: String },
    mainColor: { type: String },
    colors: {
      color100: String,
      color80: String,
      color60: String,
      color40: String,
      color30: String,
    },
    gradientColors: {
      colorTop: String,
      colorBottom: String,
    },
    position: {
      type: Number,
      validate: {
        validator: (v: number) => Number.isInteger(v) && v >= 0,
        message: "position must be an positive integer",
      },
      required: true,
    },
    icon: { type: ImageSchema, _id: false },
    banner: { type: ImageSchema, _id: false },
    appBanner: { type: ImageSchema, _id: false },
    appImage: { type: ImageSchema, _id: false },
    shareImage: { type: ImageSchema, _id: false },
    dispositifImage: { type: ImageSchema, _id: false },
    demarcheImage: { type: ImageSchema, _id: false },
    notificationEmoji: { type: String },
    adminComments: { type: String },
  },
  {
    collection: "themes",
    timestamps: { createdAt: "created_at" },
  },
);

// Method implementation
ThemeSchema.methods.isActive = function (this: Theme, activeLanguages: Langue[]): boolean {
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

export const ThemeModel = model<Theme>("Theme", ThemeSchema);
