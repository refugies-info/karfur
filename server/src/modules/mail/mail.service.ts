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

interface PublishedFicheMailToStructureMembersData {
  pseudo: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: ObjectId;
  userId: ObjectId;
}

export const sendPublishedFicheMailToStructureMembersService = async (
  data: PublishedFicheMailToStructureMembersData
) => {
  try {
    logger.info("[sendPublishedFicheMail] received");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: data.pseudo,
        titreInformatif: data.titreInformatif,
        lien: data.lien,
        titreMarque: data.titreMarque,
      },
    };
    const templateName = "publishedFicheToStructureMembers";
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      userId: data.userId,
      dispositifId: data.dispositifId,
    });
    return;
  } catch (error) {
    logger.error("[sendPublishedFicheMail] error", {
      error: error.message,
    });
  }
};

interface PublishedFicheMailToCreatorData {
  pseudo: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: ObjectId;
  userId: ObjectId;
}
export const sendPublishedFicheMailToCreatorService = async (
  data: PublishedFicheMailToCreatorData
) => {
  try {
    logger.info("[sendPublishedFicheMailToCreatorService] received ");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        pseudo: data.pseudo,
        titreInformatif: data.titreInformatif,
        lien: data.lien,
        titreMarque: data.titreMarque,
      },
    };
    const templateName = "publishedFicheToCreator";
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      userId: data.userId,
      dispositifId: data.dispositifId,
    });
    return;
  } catch (error) {
    logger.error("[sendPublishedFicheMailToCreatorService] error", {
      error: error.message,
    });
  }
};

interface PublishedTradMailToStructure {
  dispositifId: ObjectId;
  userId: ObjectId;
  titreInformatif: string;
  titreMarque: string;
  langue: string;
  lien: string;
  email: string;
  pseudo: string;
}
export const sendPublishedTradMailToStructureService = async (
  data: PublishedTradMailToStructure
) => {
  try {
    logger.info("[sendPublishedTradMailToStructure] received");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: data.titreInformatif,
        titreMarque: data.titreMarque,
        lien: data.lien,
        langue: data.langue,
      },
    };
    const templateName = "publishedTradForStructure";
    // @ts-ignore
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      userId: data.userId,
      dispositifId: data.dispositifId,
      langue: data.langue,
    });
    return;
  } catch (error) {
    logger.error("[sendPublishedTradMailToStructure] error", {
      error: error.message,
    });
  }
};

interface NewFicheEnAttenteMail {
  dispositifId: ObjectId;
  userId: ObjectId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
}
export const sendNewFicheEnAttenteMail = async (
  data: NewFicheEnAttenteMail
) => {
  try {
    logger.info("[sendNewFicheEnAttenteMail] received");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: data.titreInformatif,
        titreMarque: data.titreMarque,
        lien: data.lien,
      },
    };
    const templateName = "newFicheEnAttente";
    // @ts-ignore
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      userId: data.userId,
      dispositifId: data.dispositifId,
    });
    return;
  } catch (error) {
    logger.error("[sendNewFicheEnAttenteMail] error", {
      error: error.message,
    });
  }
};

interface PublishedTradMailToTraductors {
  dispositifId: ObjectId;
  userId: string;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
  langue: string;
  isDispositif: boolean;
}
export const sendPublishedTradMailToTraductorsService = async (
  data: PublishedTradMailToTraductors
) => {
  try {
    logger.info("[sendPublishedTradMailToTraductorsService] received");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        titreInformatif: data.titreInformatif,
        titreMarque: data.titreMarque,
        lien: data.lien,
        isDispositif: data.isDispositif,
        langue: data.langue,
        pseudo: data.pseudo,
      },
    };
    const templateName = "publishedTradForTraductors";
    // @ts-ignore
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      // @ts-ignore
      userId: data.userId,
      dispositifId: data.dispositifId,
      langue: data.langue,
    });
    return;
  } catch (error) {
    logger.error("[sendPublishedTradMailToTraductorsService] error", {
      error: error.message,
    });
  }
};

interface AdminImprovementsMail {
  dispositifId: ObjectId;
  userId: ObjectId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
  sectionsToModify: Object;
}

export const sendAdminImprovementsMailService = async (
  data: AdminImprovementsMail
) => {
  try {
    logger.info("[sendAdminImprovementsMailService] received");

    const dynamicData = {
      to: data.email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      cc: "alice@refugies.info",
      dynamicTemplateData: {
        titreInformatif: data.titreInformatif,
        titreMarque: data.titreMarque,
        lien: data.lien,
        pseudo: data.pseudo,
        sectionsToModify: data.sectionsToModify,
      },
    };
    const templateName = "reviewFiche";
    // @ts-ignore
    sendMail(templateName, dynamicData);
    await addMailEvent({
      templateName,
      username: data.pseudo,
      email: data.email,
      // @ts-ignore
      userId: data.userId,
      dispositifId: data.dispositifId,
    });
    return;
  } catch (error) {
    logger.error("[sendAdminImprovementsMailService] error", {
      error: error.message,
    });
  }
};
