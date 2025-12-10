import { type DispositifId, type MailEvent, MailEventModel, type UserId } from "~/typegoose";
import type { Modify } from "~/types/interface";

export const addMailEvent = (
  mailEvent: Modify<MailEvent, { userId?: UserId; dispositifId?: DispositifId }>,
) => MailEventModel.create(mailEvent as any);
