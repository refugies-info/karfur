import { TemplateName, DynamicData } from "./sendgrid.types";
import logger from "../../logger";
import { templatesIds } from "./templatesIds";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = (
  templateName: TemplateName,
  dynamicData: DynamicData
) => {
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

  const msg = {
    ...dynamicData,
    template_id: templatesIds[templateName],
  };
  sgMail
    .send(msg)
    .then(() => { }, (error: any) => {
      logger.error("[sendMail] error, email not sent", error);

      if (error.response) {
        logger.error("[sendMail] error details", error.response.body);
      }
    })
    .catch((e: any) => logger.error("[sendMail] error", e));
};
