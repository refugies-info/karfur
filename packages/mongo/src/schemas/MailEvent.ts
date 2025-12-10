import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { model, type Types } from "mongoose";
import { z } from "zod";

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

export type MailEvent = z.infer<typeof MailEventSchema> & Document;
export type MailEventId = Types.ObjectId;

export const MailEventMongooseSchema = zodSchema(MailEventSchema);
MailEventMongooseSchema.set("collection", "mails");
MailEventMongooseSchema.set("timestamps", { createdAt: "created_at" });

export const MailEventModel = model("MailEvent", MailEventMongooseSchema);
