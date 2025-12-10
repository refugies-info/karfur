import { zodSchema } from "@zodyac/zod-mongoose";
import { model, type Types } from "mongoose";
import { z } from "zod";

// Notification Schema
export const NotificationSchema = z.object({
  uid: z.string(),
  seen: z.boolean().default(false),
  title: z.string(),
  data: z.record(z.unknown()),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Notification = z.infer<typeof NotificationSchema> & Document;
export type NotificationId = Types.ObjectId;

export const NotificationMongooseSchema = zodSchema(NotificationSchema);
NotificationMongooseSchema.set("collection", "notifications");
NotificationMongooseSchema.set("timestamps", true);

export const NotificationModel = model("Notification", NotificationMongooseSchema);
