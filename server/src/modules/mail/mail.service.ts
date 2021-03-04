import { sendMail } from "../../connectors/sendgrid/sendMail";
import logger from "../../logger";
import { addMailEvent } from "./mail.repository";

export const sendWelcomeMail = async (email: string, username: string) => {
  try {
    logger.info("[sendWelcomeMail] received", { email });
    const dynamicData = {
      to: email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      // cc: "contact@refugies.info",
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: username,
      },
    };
    const templateName = "newUserWelcome";
    sendMail(templateName, dynamicData);
    await addMailEvent({ templateName, username, email });
    return;
  } catch (error) {
    logger.error("[sendWelcomeMail] error", { email, error: error.message });
  }
};
