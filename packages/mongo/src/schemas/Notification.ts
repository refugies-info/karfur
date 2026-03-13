import { zodSchema } from "@zodyac/zod-mongoose";
import { type Document, model, type Types } from "mongoose";
import { z } from "zod";

// Notification Schema
export const NotificationSchema = z.object({
  uid: z.string(),
  seen: z.boolean().default(false),
  title: z.string(),
  data: z.record(z.any()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema> & Document<Types.ObjectId>;
/**
 * NotificationId represents a unique identifier for a Notification.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `Notification` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type NotificationId = Types.ObjectId | string;

export const NotificationMongooseSchema = zodSchema(NotificationSchema);
NotificationMongooseSchema.set("collection", "notifications");
NotificationMongooseSchema.set("timestamps", true);

export const NotificationModel = model("Notification", NotificationMongooseSchema);
