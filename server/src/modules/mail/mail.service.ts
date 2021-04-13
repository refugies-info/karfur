import { sendMail } from "../../connectors/sendgrid/sendMail";
import logger from "../../logger";
import { addMailEvent } from "./mail.repository";
import { ObjectId } from "mongoose";

export const sendWelcomeMail = async (
  email: string,
  username: string,
  userId: ObjectId
) => {
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
    await addMailEvent({ templateName, username, email, userId });
    return;
  } catch (error) {
    logger.error("[sendWelcomeMail] error", { email, error: error.message });
  }
};

export const sendOneDraftReminderMailService = async (
  email: string,
  username: string,
  titreInformatif: string,
  userId: ObjectId,
  dispositifId: ObjectId
) => {
  try {
    logger.info("[sendOneDraftReminderMailService]  received", {
      email,
      dispositifId,
    });
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
        titreInformatif,
      },
    };
    const templateName = "oneDraftReminder";
    sendMail(templateName, dynamicData);
    await addMailEvent({ templateName, username, email, userId, dispositifId });
    return;
  } catch (error) {
    logger.error("[sendOneDraftReminderMailService] error", {
      email,
      error: error.message,
    });
  }
};

export const sendMultipleDraftsReminderMailService = async (
  email: string,
  username: string,
  userId: ObjectId
) => {
  try {
    logger.info("[sendMultipleDraftsReminderMailService] received", {
      email,
    });
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
    const templateName = "multipleDraftsReminder";
    sendMail(templateName, dynamicData);
    await addMailEvent({ templateName, username, email, userId });
    return;
  } catch (error) {
    logger.error("[sendMultipleDraftsReminderMailService] error", {
      email,
      error: error.message,
    });
  }
};

export const sendPublishedFicheMail = () => {
  try {
    logger.info("[sendPublishedFicheMail] received");

    const dynamicData = {
      to: "agkieny@gmail.com",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "agathe",
        titreInformatif: "titre",
        lien: "http://localhost:3000/dispositif/5f918fbafc486c0047ef548d",
      },
    };
    const templateName = "publishedFiche";
    sendMail(templateName, dynamicData);
    // await addMailEvent({ templateName, username, email, userId });
    return;
  } catch (error) {
    logger.error("[sendPublishedFicheMail] error", {
      error: error.message,
    });
  }
};

export const sendReviewFicheMail = () => {
  try {
    logger.info("[sendReviewFicheMail] received");

    const dynamicData = {
      to: "agkieny@gmail.com",
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: "agathe",
        titreInformatif: "titre",
        lien: "http://localhost:3000/dispositif/5f918fbafc486c0047ef548d",
        rubrique: { quoi: true, qui: false },
      },
    };
    const templateName = "reviewFiche";
    // @ts-ignore
    sendMail(templateName, dynamicData);
    // await addMailEvent({ templateName, username, email, userId });
    return;
  } catch (error) {
    logger.error("[sendReviewFicheMail] error", {
      error: error.message,
    });
  }
};
