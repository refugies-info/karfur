import { Schema, model, Document } from "mongoose";

export interface NotificationType extends Document {
  uid: string;
  seen: boolean;
  title: string;
  data: {};
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema = new Schema(
  {
    uid: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Notification = model<NotificationType>("Notification", NotificationSchema, "notifications");
