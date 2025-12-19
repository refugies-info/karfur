import sgMail from "@sendgrid/mail";
import logger from "../../logger";
import type { DynamicData, TemplateName } from "./sendgrid.types";
import { templatesIds } from "./templatesIds";

const UNSUBSCRIBE_GROUP_ID = 137241;

export const sendMail = (
  templateName: TemplateName,
  dynamicData: DynamicData,
  bypassUnsubscribe?: boolean,
) => {
  if (process.env.NODE_ENV === "dev") {
    logger.info("[sendMail] no mail sent in dev env", dynamicData);
    return;
  }
  if (!dynamicData.from.email) {
    logger.error("[sendMail] no email provided");
    throw new Error("NO_EMAIL_PROVIDED");
  }

  logger.info("[sendMail] send mail received with", {
    email: dynamicData.to,
    templateName,
  });

  let msg: sgMail.MailDataRequired = {
    ...dynamicData,
    templateId: templatesIds[templateName],
    asm: {
      groupId: UNSUBSCRIBE_GROUP_ID,
      groupsToDisplay: [UNSUBSCRIBE_GROUP_ID],
    },
  };

  if (bypassUnsubscribe) {
    msg = {
      ...msg,
      mailSettings: {
        bypassListManagement: { enable: true },
        sandboxMode: { enable: process.env.NODE_ENV === "test" },
      },
    };
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  sgMail
    .send(msg)
    .then(
      () => {},
      (error: unknown) => {
        logger.error("[sendMail] error, email not sent", String(error));

        if (
          typeof error === "object" &&
          "response" in error &&
          typeof error.response === "object" &&
          "body" in error.response &&
          typeof error.response.body === "object" &&
          "message" in error.response.body
        ) {
          logger.error("[sendMail] error details", String(error.response.body.message));
        }
      },
    )
    .catch((e: unknown) => logger.error("[sendMail] error", String(e)));
};
