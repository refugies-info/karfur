import { model, Schema, type Types } from "mongoose";
import { z } from "zod";
import type { DispositifId } from "./Dispositif";
import type { UserId } from "./User";

// MailEvent Schema
export const MailEventSchema = z.object({
  templateName: z.string(),
  email: z.string().email(),
  langue: z.string().optional(),
  userId: z.custom<UserId>().optional(),
  dispositifId: z.custom<DispositifId>().optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MailEventType = z.infer<typeof MailEventSchema> & { _id: Types.ObjectId };
export type MailEventId = Types.ObjectId | string;

export interface MailEvent extends Omit<MailEventType, "userId" | "dispositifId"> {
  userId?: UserId;
  dispositifId?: DispositifId;
}

export const MailEventMongooseSchema = new Schema<MailEvent>(
  {
    templateName: { type: String, required: true },
    email: { type: String, required: true },
    langue: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    dispositifId: { type: Schema.Types.ObjectId, ref: "Dispositif" },
  },
  {
    collection: "mails",
    timestamps: { createdAt: "created_at" },
  },
);

export const MailEventModel = model<MailEvent>("MailEvent", MailEventMongooseSchema);
