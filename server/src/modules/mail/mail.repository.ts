import { DispositifId, MailEvent, MailEventModel, UserId } from "src/typegoose";
import { Modify } from "src/types/interface";

export const addMailEvent = (mailEvent: Modify<MailEvent, { userId?: UserId; dispositifId?: DispositifId }>) =>
  MailEventModel.create(mailEvent);
