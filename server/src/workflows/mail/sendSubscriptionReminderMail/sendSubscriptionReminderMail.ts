import { Response } from "../../../types/interface";
import logger from "../../../logger";
import { sendSubscriptionReminderMailService } from "../../../modules/mail/mail.service";
import { SubscriptionRequest } from "src/controllers/mailController";

export const sendSubscriptionReminderMail = async (body: SubscriptionRequest): Response => {
  logger.info("[sendSubscriptionReminderMail] received with data", { data: body });
  await sendSubscriptionReminderMailService(body.email);
  return { text: "success" };
};
