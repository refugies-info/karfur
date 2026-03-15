import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { type Document, type Model, model, models, type Types } from "mongoose";
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

export type MailEvent = z.infer<typeof MailEventSchema> & Document<Types.ObjectId>;
export type MailEventType = z.infer<typeof MailEventSchema>;
/**
 * MailEventId represents a unique identifier for a MailEvent.
 *
 * Rationale for `| string` union:
 * 1. **API Compatibility**: IDs received from frontend/API (URL params, JSON bodies) are strings.
 * 2. **Flexibility**: Allows service functions to accept raw strings without forcing immediate `new ObjectId()` casting at the controller layer.
 * 3. **Note**: The Mongoose `MailEvent` document strictly uses `Types.ObjectId` for its `_id` field.
 */
export type MailEventId = Types.ObjectId | string;

export const MailEventMongooseSchema = zodSchema(MailEventSchema);
MailEventMongooseSchema.set("collection", "mails");
MailEventMongooseSchema.set("timestamps", { createdAt: "created_at" });

// HMR-safe: use existing model if already compiled (Next.js dev mode)
export const MailEventModel = (models.MailEvent ||
  model("MailEvent", MailEventMongooseSchema)) as Model<MailEvent>;
