import type { ThemeGradientColors } from "@refugies-info/api-types";
import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import { type Image, ImageZodSchema } from "./generics";
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
export interface Theme extends Document {
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

export const ThemeModel = model<Theme>("Theme", ThemeMongooseSchema as unknown as Schema<Theme>);
