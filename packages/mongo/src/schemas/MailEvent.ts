import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { model, type Schema, type Types } from "mongoose";
import { z } from "zod";
import type { DispositifId } from "./Dispositif";
import type { UserId } from "./User";

// MailEvent Schema
export const MailEventSchema = z.object({
  templateName: z.string(),
  email: z.string().email(),
  langue: z.string().optional(),
  userId: zId("User").optional(),
  dispositifId: zId("Dispositif").optional(),
  created_at: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type MailEventType = z.infer<typeof MailEventSchema>;
export type MailEventId = Types.ObjectId | string;

export interface MailEvent extends Omit<MailEventType, "userId" | "dispositifId">, Document {
  userId?: UserId;
  dispositifId?: DispositifId;
}

export const MailEventMongooseSchema = zodSchema(MailEventSchema);
MailEventMongooseSchema.set("collection", "mails");
MailEventMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const MailEventModel = model<MailEvent>(
  "MailEvent",
  MailEventMongooseSchema as unknown as Schema<MailEvent>,
);
