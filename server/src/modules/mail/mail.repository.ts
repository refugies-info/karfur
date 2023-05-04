import { DispositifId, MailEvent, MailEventModel, UserId } from "../../typegoose";
import { Modify } from "../../types/interface";

export const addMailEvent = (mailEvent: Modify<MailEvent, { userId?: UserId; dispositifId?: DispositifId }>) =>
  MailEventModel.create(mailEvent);
