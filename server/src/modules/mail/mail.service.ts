import { sendMail } from "../../connectors/sendgrid/sendMail";
import logger from "../../logger";

export const sendWelcomeMail = (email: string, username: string) => {
  try {
    logger.info("[sendWelcomeMail] received", { email });
    const dynamicData = {
      to: email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      cc: "agathe@refugies.info",
      dynamicTemplateData: {
        pseudo: username,
      },
    };
    return sendMail("newUserWelcome", dynamicData);
  } catch (error) {
    logger.error("[sendWelcomeMail] error", { email, error: error.message });
  }
};
