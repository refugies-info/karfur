import { TemplateName, DynamicData } from "./sendgrid.types";
import logger from "../../logger";
import { templatesIds } from "./templatesIds";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendMail = async (
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

  logger.info("[sendMail] send mail received", {
    email: dynamicData.to,
    templateName,
  });

  const msg = {
    ...dynamicData,
    template_id: templatesIds[templateName],
  };
  return sgMail.send(msg);
};
