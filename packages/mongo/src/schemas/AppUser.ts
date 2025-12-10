import type { Languages } from "@refugies-info/api-types";
import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Schema, type Types } from "mongoose";
import { z } from "zod";

export const NotificationsSettingsZodSchema = z.object({
  global: z.boolean(),
  local: z.boolean(),
  demarches: z.boolean(),
  themes: z.record(z.boolean()),
});

export const AppUserZodSchema = z.object({
  uid: z.string(),
  city: z.string().optional(),
  department: z.string().optional(),
  selectedLanguage: z.string().optional(),
  age: z.string().optional(),
  frenchLevel: z.string().optional(),
  expoPushToken: z.string().optional(),
  notificationsSettings: NotificationsSettingsZodSchema.optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AppUserType = z.infer<typeof AppUserZodSchema>;

export interface NotificationsSettings {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: { [key: string]: boolean };
}

export interface AppUser extends Document {
  _id: Types.ObjectId;
  uid: string;
  city?: string;
  department?: string;
  selectedLanguage?: Languages;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
  notificationsSettings?: NotificationsSettings;
  created_at?: Date;
  updatedAt?: Date;
}

export type AppUserId = AppUser["_id"] | AppUser["id"];

const AppUserSchema = zodSchema(AppUserZodSchema);
AppUserSchema.path("uid").unique(true);
AppUserSchema.set("collection", "appusers");
AppUserSchema.set("timestamps", true);

// Configure sub-schema _id: false manually if needed, usually zodSchema generates sub-schemas.
// We can access properties.
// NotificationsSettings is generic object in Zod?
// zod-mongoose treats embedded objects as subdocuments.
// We want _id: false for notificationsSettings.
// Accessing path:
const nsPath = AppUserSchema.path("notificationsSettings") as any;
if (nsPath && nsPath.schema) {
  nsPath.schema.set("_id", false);
}

export const AppUserModel = model<AppUser>("AppUser", AppUserSchema as unknown as Schema<AppUser>);
