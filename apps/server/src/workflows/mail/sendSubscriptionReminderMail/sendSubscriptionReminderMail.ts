import { SubscriptionRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { sendSubscriptionReminderMailService } from "~/modules/mail/mail.service";
import { Response } from "~/types/interface";

export const sendSubscriptionReminderMail = async (body: SubscriptionRequest): Response => {
  logger.info("[sendSubscriptionReminderMail] received with data", { data: body });
  await sendSubscriptionReminderMailService(body.email);
  return { text: "success" };
};
