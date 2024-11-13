import { sendMail } from "~/connectors/sendgrid/sendMail";
import logger from "~/logger";
import { DispositifId, UserId } from "~/typegoose";
import { consentsToEmail } from "./helpers";
import { addMailEvent } from "./mail.repository";

export const sendWelcomeMail = async (email: string, firstName: string, userId: UserId) => {
  if (consentsToEmail(userId, "newUserWelcome")) {
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
          firstName,
          email,
        },
      };
      const templateName = "newUserWelcome";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({ templateName, email, userId });
      return;
    } catch (error) {
      logger.error("[sendWelcomeMail] error", { email, error: error.message });
    }
  } else {
    logger.info("[sendWelcomeMail] user has not consented to email", { email });
  }
};

export const sendResetPasswordMail = async (username: string, lien_reinitialisation: string, email: string) => {
  if (consentsToEmail(username, "resetPassword")) {
    try {
      logger.info("[sendResetPasswordMail] received", { email });
      const dynamicData = {
        to: email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        reply_to: "contact@email.refugies.info",
        dynamicTemplateData: {
          lien_reinitialisation: lien_reinitialisation,
        },
      };
      const templateName = "resetPassword";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({ templateName, username, email });
      return;
    } catch (error) {
      logger.error("[sendResetPasswordMail] error", {
        email,
        error: error.message,
      });
    }
  } else {
    logger.info("[sendResetPasswordMail] user has not consented to email", { email });
  }
};

export const sendSubscriptionReminderMailService = async (email: string) => {
  if (consentsToEmail(email, "subscriptionReminderMail")) {
    try {
      logger.info("[sendSubscriptionReminderMailService] received", { email });
      const dynamicData = {
        to: email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        // cc: "contact@refugies.info",
        reply_to: "contact@email.refugies.info",
      };
      const templateName = "subscriptionReminderMail";
      sendMail(templateName, dynamicData);
      await addMailEvent({ templateName, email });
      return;
    } catch (error) {
      logger.error("[sendSubscriptionReminderMailService] error", {
        email,
        error: error.message,
      });
    }
  } else {
    logger.info("[sendSubscriptionReminderMailService] user has not consented to email", { email });
  }
};

export const sendOneDraftReminderMailService = async (
  email: string,
  username: string,
  titreInformatif: string,
  userId: UserId,
  dispositifId: DispositifId,
  reminder: "first" | "second",
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
    const templateName = reminder === "first" ? "oneDraftReminder" : "secondOneDraftReminder";
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

export const sendUpdateReminderMailService = async (
  email: string,
  username: string,
  titreInformatif: string,
  userId: UserId,
  dispositifId: DispositifId,
  lienFiche: string,
) => {
  if (consentsToEmail(userId, "updateReminder")) {
    try {
      logger.info("[sendUpdateReminderMailService]  received", {
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
          Pseudonyme: username,
          titreInformatif,
          lienFiche,
        },
      };
      const templateName = "updateReminder";
      sendMail(templateName, dynamicData);

      await addMailEvent({ templateName, username, email, userId, dispositifId });

      return;
    } catch (error) {
      logger.error("[sendUpdateReminderMailService] error", {
        email,
        error: error.message,
      });
    }
  } else {
    logger.info("[sendUpdateReminderMailService] user has not consented to email", { email });
  }
};

export const sendMultipleDraftsReminderMailService = async (
  email: string,
  username: string,
  userId: UserId,
  reminder: "first" | "second",
) => {
  if (consentsToEmail(userId, "multipleDraftsReminder")) {
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
      const templateName = reminder === "first" ? "multipleDraftsReminder" : "secondMultipleDraftReminder";
      sendMail(templateName, dynamicData);
      await addMailEvent({ templateName, username, email, userId });
      return;
    } catch (error) {
      logger.error("[sendMultipleDraftsReminderMailService] error", {
        email,
        error: error.message,
      });
    }
  } else {
    logger.info("[sendMultipleDraftsReminderMailService] user has not consented to email", { email });
  }
};

interface PublishedFicheMailToStructureMembersData {
  pseudo: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: DispositifId;
  userId: UserId;
}

export const sendPublishedFicheMailToStructureMembersService = async (
  data: PublishedFicheMailToStructureMembersData,
) => {
  if (consentsToEmail(data.userId, "publishedFicheToStructureMembers")) {
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
    } catch (error) {
      logger.error("[sendPublishedFicheMail] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendPublishedFicheMail] user has not consented to email", { email: data.email });
  }
};

interface PublishedFicheMailToCreatorData {
  pseudo: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: DispositifId;
  userId: UserId;
}
export const sendPublishedFicheMailToCreatorService = async (data: PublishedFicheMailToCreatorData) => {
  if (consentsToEmail(data.userId, "publishedFicheToCreator")) {
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
  } else {
    logger.info("[sendPublishedFicheMailToCreatorService] user has not consented to email", { email: data.email });
  }
};

interface PublishedTradMailToStructure {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  langue: string;
  lien: string;
  email: string;
  pseudo: string;
}
export const sendPublishedTradMailToStructureService = async (data: PublishedTradMailToStructure) => {
  if (consentsToEmail(data.userId, "publishedTradForStructure")) {
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
  } else {
    logger.info("[sendPublishedTradMailToStructure] user has not consented to email", { email: data.email });
  }
};

interface NewFicheEnAttenteMail {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
}
export const sendNewFicheEnAttenteMail = async (data: NewFicheEnAttenteMail) => {
  if (consentsToEmail(data.userId, "newFicheEnAttente")) {
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
  } else {
    logger.info("[sendNewFicheEnAttenteMail] user has not consented to email", { email: data.email });
  }
};

interface PublishedTradMailToTraductors {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
  langue: string;
  isDispositif: boolean;
}
export const sendPublishedTradMailToTraductorsService = async (data: PublishedTradMailToTraductors) => {
  if (consentsToEmail(data.userId, "publishedTradForTraductors")) {
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
  } else {
    logger.info("[sendPublishedTradMailToTraductorsService] user has not consented to email", { email: data.email });
  }
};

interface AdminImprovementsMail {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  pseudo: string;
  sectionsToModify: Object;
  message: string;
}

export const sendAdminImprovementsMailService = async (data: AdminImprovementsMail) => {
  if (consentsToEmail(data.userId, "reviewFiche")) {
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
          message: data.message,
        },
      };
      const templateName = "reviewFiche";
      // @ts-ignore
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
        username: data.pseudo,
        email: data.email,
        userId: data.userId,
        dispositifId: data.dispositifId,
      });
      return;
    } catch (error) {
      logger.error("[sendAdminImprovementsMailService] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendAdminImprovementsMailService] user has not consented to email", { email: data.email });
  }
};

interface NewMemberMail {
  userId: UserId;
  email: string;
  firstName: string;
  nomstructure: string;
}

export const sendNewMemberMailService = async (data: NewMemberMail) => {
  if (consentsToEmail(data.userId, "newMember")) {
    try {
      logger.info("[sendNewMemberMailService] received");

      const dynamicData = {
        to: data.email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        reply_to: "contact@email.refugies.info",
        dynamicTemplateData: {
          firstName: data.firstName,
          nomstructure: data.nomstructure,
        },
      };
      const templateName = "newMember";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
        email: data.email,
        userId: data.userId,
      });
      return;
    } catch (error) {
      logger.error("[sendNewMemberMailService] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendNewMemberMailService] user has not consented to email", { email: data.email });
  }
};

export const sendAccountDeletedMailService = async (email: string) => {
  if (consentsToEmail(email, "accountDeleted")) {
    try {
      logger.info("[sendAccountDeletedMailService] received");

      const dynamicData = {
        to: email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        reply_to: "contact@email.refugies.info",
      };
      const templateName = "accountDeleted";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
        email: email,
      });
      return;
    } catch (error) {
      logger.error("[sendAccountDeletedMailService] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendAccountDeletedMailService] user has not consented to email", { email });
  }
};

interface FicheArchivedMail {
  firstName: string;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
}

export const sendFicheArchivedService = async (email: string, data: FicheArchivedMail) => {
  if (consentsToEmail(email, "ficheArchived")) {
    try {
      logger.info("[sendFicheArchivedService] received");

      const dynamicData = {
        to: email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        reply_to: "contact@email.refugies.info",
        dynamicTemplateData: {
          ...data,
        },
      };
      const templateName = "ficheArchived";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
        email: email,
      });
      return;
    } catch (error) {
      logger.error("[sendFicheArchivedService] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendFicheArchivedService] user has not consented to email", { email });
  }
};
