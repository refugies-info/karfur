import type { SubscriptionRequest } from "@refugies-info/api-types";
import logger from "~/logger";
import { sendSubscriptionReminderMailService } from "~/modules/mail/mail.service";
import type { Response } from "~/types/interface";

export const sendSubscriptionReminderMail = async (body: SubscriptionRequest): Response => {
  logger.info("[sendSubscriptionReminderMail] received with data", { data: body });
  // Note: userId parameter removed - newsletter subscriptions are managed via Brevo
  // and the original consent check was passing email instead of userId (bug)
  await sendSubscriptionReminderMailService(body.email);
  return { text: "success" };
};
