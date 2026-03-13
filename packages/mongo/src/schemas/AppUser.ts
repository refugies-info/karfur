import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

export const NotificationsSettingsZodSchema = z.object({
  global: z.boolean(),
  local: z.boolean(),
  demarches: z.boolean(),
  themes: z.record(z.boolean()),
});

export type NotificationsSettings = z.infer<typeof NotificationsSettingsZodSchema>;

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

export type AppUser = z.infer<typeof AppUserZodSchema> & Document<Types.ObjectId>;
export type AppUserType = z.infer<typeof AppUserZodSchema>;
/**
 * AppUserId represents a unique identifier for an AppUser.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `AppUser` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type AppUserId = AppUser["_id"] | string;

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

export const AppUserModel = model("AppUser", AppUserSchema);
