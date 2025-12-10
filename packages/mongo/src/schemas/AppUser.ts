import type { Languages } from "@refugies-info/api-types";
import { type Document, model, Schema, type Types } from "mongoose";
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
  selectedLanguage: z.string().optional(), // Typed as Languages in interface, string in Zod/DB usually fine
  age: z.string().optional(),
  frenchLevel: z.string().optional(),
  expoPushToken: z.string().optional(),
  notificationsSettings: NotificationsSettingsZodSchema.optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
  // Timestamps true in original
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

const NotificationsSettingsSchema = new Schema<NotificationsSettings>(
  {
    global: { type: Boolean, required: true },
    local: { type: Boolean, required: true },
    demarches: { type: Boolean, required: true },
    themes: { type: Map, of: Boolean, required: true },
  },
  { _id: false },
);

const AppUserSchema = new Schema<AppUser>(
  {
    uid: { type: String, required: true, unique: true },
    city: { type: String },
    department: { type: String },
    selectedLanguage: { type: String },
    age: { type: String },
    frenchLevel: { type: String },
    expoPushToken: { type: String },
    notificationsSettings: { type: NotificationsSettingsSchema },
  },
  {
    collection: "appusers",
    timestamps: true,
  },
);

export const AppUserModel = model<AppUser>("AppUser", AppUserSchema);
