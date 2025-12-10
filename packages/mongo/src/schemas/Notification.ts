import { zodSchema } from "@zodyac/zod-mongoose";
import { model, type Schema, type Types } from "mongoose";
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

export type NotificationType = z.infer<typeof NotificationSchema> & { _id: Types.ObjectId };
export type NotificationId = Types.ObjectId | string;

export interface Notification extends NotificationType {}

export const NotificationMongooseSchema = zodSchema(NotificationSchema);
NotificationMongooseSchema.set("collection", "notifications");
NotificationMongooseSchema.set("timestamps", true);

export const NotificationModel = model<Notification>(
  "Notification",
  NotificationMongooseSchema as unknown as Schema<Notification>,
);
