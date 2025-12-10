import {
  type DispositifId,
  type MailEvent,
  MailEventModel,
  type UserId,
} from "@refugies-info/mongo";
import type { Modify } from "~/types/interface";

export const addMailEvent = (
  mailEvent: Modify<Omit<MailEvent, "_id">, { userId?: UserId; dispositifId?: DispositifId }>,
) => MailEventModel.create(mailEvent as any);
