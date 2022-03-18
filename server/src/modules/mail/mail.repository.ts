import { MailEvent } from "../../schema/schemaMailEvent";
import { IMailEvent } from "../../types/interface";

export const addMailEvent = (mailEvent: IMailEvent) =>
  MailEvent.create(mailEvent);
