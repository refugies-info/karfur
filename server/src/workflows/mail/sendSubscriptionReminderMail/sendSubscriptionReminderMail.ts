import { RequestFromClientWithBody, Res } from "../../../types/interface";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { sendSubscriptionReminderMailService } from "../../../modules/mail/mail.service";

interface Query {
  email: string;
}

export const sendSubscriptionReminderMail = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[sendSubscriptionReminderMail] received with data", {
      data: req.body,
    });

    checkRequestIsFromSite(req.fromSite);
    await sendSubscriptionReminderMailService(req.body.email);

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendSubscriptionReminderMail] error", {
      error: error.message,
    });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
