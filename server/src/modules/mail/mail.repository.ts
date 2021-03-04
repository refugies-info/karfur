import { MailEvent } from "../../schema/schemaMailEvent";
import { IMailEvent } from "../../types/interface";

export const addMailEvent = async (mailEvent: IMailEvent) =>
  // @ts-ignore
  await MailEvent.create(mailEvent);
