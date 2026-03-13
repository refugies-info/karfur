import {
  type DispositifId,
  MailEventModel,
  type MailEventType,
  type UserId,
} from "@refugies-info/mongo";

export const addMailEvent = (
  mailEvent: Omit<MailEventType, "_id" | "userId" | "dispositifId"> & {
    userId?: UserId;
    dispositifId?: DispositifId;
  },
) => MailEventModel.create(mailEvent as any);
