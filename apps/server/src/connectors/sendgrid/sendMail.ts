import logger from "../../logger";
import { DynamicData, TemplateName } from "./sendgrid.types";
import { templatesIds } from "./templatesIds";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const UNSUBSCRIBE_GROUP_ID = 137241;

export const sendMail = (templateName: TemplateName, dynamicData: DynamicData, bypassUnsubscribe?: boolean) => {
  if (process.env.NODE_ENV === "dev") {
    logger.info("[sendMail] no mail sent in dev env");
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

  const msg: any = {
    ...dynamicData,
    template_id: templatesIds[templateName],
    asm: {
      groupId: UNSUBSCRIBE_GROUP_ID,
      groupsToDisplay: [UNSUBSCRIBE_GROUP_ID],
    },
  };

  if (bypassUnsubscribe) {
    msg.mail_settings = {
      bypass_list_management: { enable: true },
    };
  }

  sgMail
    .send(msg)
    .then(
      () => {},
      (error: any) => {
        logger.error("[sendMail] error, email not sent", error);

        if (error.response) {
          logger.error("[sendMail] error details", error.response.body);
        }
      },
    )
    .catch((e: any) => logger.error("[sendMail] error", e));
};
