import type { DispositifId, StructureId, UserId } from "@refugies-info/mongo";
import { sendMail } from "~/connectors/sendgrid/sendMail";
import logger from "~/logger";
import { consentsToEmail } from "./helpers";
import { addMailEvent } from "./mail.repository";

export const sendWelcomeMail = async (email: string, firstName: string, userId: UserId) => {
  if (await consentsToEmail(userId, "newUserWelcome")) {
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

export const sendResetPasswordMail = async (
  userId: string,
  lien_reinitialisation: string,
  email: string,
) => {
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
    await addMailEvent({ templateName, userId, email });
    return;
  } catch (error) {
    logger.error("[sendResetPasswordMail] error", {
      email,
      error: error.message,
    });
  }
};

/**
 * Send subscription reminder mail.
 * Note: userId is optional because this is for newsletter subscriptions managed via Brevo.
 * If no userId is provided, the consent check is skipped (always sends).
 */
export const sendSubscriptionReminderMailService = async (email: string, userId?: UserId) => {
  // Skip consent check if no userId provided (newsletter subscriptions are managed via Brevo)
  const shouldSend = userId ? await consentsToEmail(userId, "subscriptionReminderMail") : true;

  if (shouldSend) {
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
  firstName: string,
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
        firstName,
        titreInformatif,
      },
    };
    const templateName = reminder === "first" ? "oneDraftReminder" : "secondOneDraftReminder";
    sendMail(templateName, dynamicData);
    await addMailEvent({ templateName, email, userId, dispositifId });
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
  firstName: string,
  titreInformatif: string,
  userId: UserId,
  dispositifId: DispositifId,
  lienFiche: string,
) => {
  if (await consentsToEmail(userId, "updateReminder")) {
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
          firstName,
          titreInformatif,
          lienFiche,
        },
      };
      const templateName = "updateReminder";
      sendMail(templateName, dynamicData);

      await addMailEvent({ templateName, email, userId, dispositifId });

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
  firstName: string,
  userId: UserId,
  reminder: "first" | "second",
) => {
  if (await consentsToEmail(userId, "multipleDraftsReminder")) {
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
          firstName,
        },
      };
      const templateName =
        reminder === "first" ? "multipleDraftsReminder" : "secondMultipleDraftReminder";
      sendMail(templateName, dynamicData);
      await addMailEvent({ templateName, email, userId });
      return;
    } catch (error) {
      logger.error("[sendMultipleDraftsReminderMailService] error", {
        email,
        error: error.message,
      });
    }
  } else {
    logger.info("[sendMultipleDraftsReminderMailService] user has not consented to email", {
      email,
    });
  }
};

interface PublishedFicheMailToStructureMembersData {
  firstName: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: DispositifId;
  userId: UserId;
  structureId: StructureId;
}

export const sendPublishedFicheMailToStructureMembersService = async (
  data: PublishedFicheMailToStructureMembersData,
) => {
  if (await consentsToEmail(data.userId, "publishedFicheToStructureMembers", data.structureId)) {
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
          firstName: data.firstName,
          titreInformatif: data.titreInformatif,
          lien: data.lien,
          titreMarque: data.titreMarque,
        },
      };
      const templateName = "publishedFicheToStructureMembers";

      sendMail(templateName, dynamicData);
      await addMailEvent({
        templateName,
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
  firstName: string;
  titreInformatif: string;
  titreMarque?: string;
  lien: string;
  email: string;
  dispositifId: DispositifId;
  userId: UserId;
  structureId?: StructureId;
}
export const sendPublishedFicheMailToCreatorService = async (
  data: PublishedFicheMailToCreatorData,
) => {
  if (await consentsToEmail(data.userId, "publishedFicheToCreator", data.structureId)) {
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
          firstName: data.firstName,
          titreInformatif: data.titreInformatif,
          lien: data.lien,
          titreMarque: data.titreMarque,
        },
      };
      const templateName = "publishedFicheToCreator";
      sendMail(templateName, dynamicData);
      await addMailEvent({
        templateName,
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
    logger.info("[sendPublishedFicheMailToCreatorService] user has not consented to email", {
      email: data.email,
    });
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
  firstName: string;
  structureId?: StructureId;
}
export const sendPublishedTradMailToStructureService = async (
  data: PublishedTradMailToStructure,
) => {
  if (await consentsToEmail(data.userId, "publishedTradForStructure", data.structureId)) {
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
          firstName: data.firstName,
        },
      };
      const templateName = "publishedTradForStructure";
      sendMail(templateName, dynamicData);
      await addMailEvent({
        templateName,
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
    logger.info("[sendPublishedTradMailToStructure] user has not consented to email", {
      email: data.email,
    });
  }
};

interface NewFicheEnAttenteMail {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  firstName: string;
  structureId?: StructureId;
}
export const sendNewFicheEnAttenteMail = async (data: NewFicheEnAttenteMail) => {
  if (await consentsToEmail(data.userId, "newFicheEnAttente", data.structureId)) {
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
          firstName: data.firstName,
        },
      };
      const templateName = "newFicheEnAttente";
      sendMail(templateName, dynamicData);
      await addMailEvent({
        templateName,
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
    logger.info("[sendNewFicheEnAttenteMail] user has not consented to email", {
      email: data.email,
    });
  }
};

interface PublishedTradMailToTraductors {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  firstName: string;
  langue: string;
  isDispositif: boolean;
}
export const sendPublishedTradMailToTraductorsService = async (
  data: PublishedTradMailToTraductors,
) => {
  if (await consentsToEmail(data.userId, "publishedTradForTraductors")) {
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
          isDispositif: data.isDispositif.toString(),
          langue: data.langue,
          firstName: data.firstName,
        },
      };
      const templateName = "publishedTradForTraductors";
      sendMail(templateName, dynamicData);
      await addMailEvent({
        templateName,
        email: data.email,
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
    logger.info("[sendPublishedTradMailToTraductorsService] user has not consented to email", {
      email: data.email,
    });
  }
};

interface AdminImprovementsMail {
  dispositifId: DispositifId;
  userId: UserId;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  email: string;
  firstName: string;
  sectionsToModify: object;
  message: string;
}

export const sendAdminImprovementsMailService = async (data: AdminImprovementsMail) => {
  if (await consentsToEmail(data.userId, "reviewFiche")) {
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
          firstName: data.firstName,
          sectionsToModify: data.sectionsToModify,
          message: data.message,
        },
      };
      const templateName = "reviewFiche";
      //@ts-expect-error dynamicTemplateData type is too restrictive
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
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
    logger.info("[sendAdminImprovementsMailService] user has not consented to email", {
      email: data.email,
    });
  }
};

interface NewMemberMail {
  userId: UserId;
  email: string;
  firstName: string;
  nomstructure: string;
}

export const sendNewMemberMailService = async (data: NewMemberMail) => {
  if (await consentsToEmail(data.userId, "newMember")) {
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
    logger.info("[sendNewMemberMailService] user has not consented to email", {
      email: data.email,
    });
  }
};

export const sendAccountDeletedMailService = async (email: string, userId: UserId) => {
  if (await consentsToEmail(userId, "accountDeleted")) {
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

export const sendFicheArchivedService = async (
  email: string,
  userId: UserId,
  data: FicheArchivedMail,
) => {
  if (await consentsToEmail(userId, "ficheArchived")) {
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

interface ValidatedAndPublished {
  userId: UserId;
  email: string;
  firstName: string;
  titreInformatif: string;
  titreMarque: string;
  lien: string;
  structureId?: StructureId;
}

export const sendValidatedAndPublishedMailService = async (data: ValidatedAndPublished) => {
  logger.info("[sendValidatedAndPublishedMailService] ENTRY", {
    userId: data.userId?.toString(),
    email: data.email,
    structureId: data.structureId?.toString(),
    hasStructureId: !!data.structureId,
  });
  if (await consentsToEmail(data.userId, "validatedAndPublished", data.structureId)) {
    try {
      logger.info("[sendValidatedAndPublishedMailService] received");

      const dynamicData = {
        to: data.email,
        from: {
          email: "contact@refugies.info",
          name: "L'équipe de Réfugiés.info",
        },
        reply_to: "contact@email.refugies.info",
        dynamicTemplateData: {
          firstName: data.firstName,
          titreInformatif: data.titreInformatif,
          titreMarque: data.titreMarque,
          lien: data.lien,
        },
      };
      const templateName = "validatedAndPublished";
      sendMail(templateName, dynamicData, true);
      await addMailEvent({
        templateName,
        email: data.email,
        userId: data.userId,
      });
      return;
    } catch (error) {
      logger.error("[sendValidatedAndPublishedMailService] error", {
        error: error.message,
      });
    }
  } else {
    logger.info("[sendValidatedAndPublishedMailService] user has not consented to email", {
      email: data.email,
    });
  }
};

export const sendNewsletterSubscriptionEmail = async (email: string, prefill: boolean) => {
  try {
    logger.info("[sendNewsletterSubscriptionEmail] received", { email });
    const dynamicData = {
      to: email,
      from: {
        email: "contact@refugies.info",
        name: "L'équipe de Réfugiés.info",
      },
      reply_to: "contact@email.refugies.info",
      dynamicTemplateData: {
        brevo_form_url: prefill
          ? `https://app.brevo.com/contact/forms/subscription/edit/67bc78579db2ed76cb17f329?email=${email}`
          : "https://app.brevo.com/contact/forms/subscription/edit/67bc78579db2ed76cb17f329",
      },
    };
    const templateName = "newsletterSubscriptionConfirmation";
    sendMail(templateName, dynamicData, true);
    await addMailEvent({ templateName, email });
    return;
  } catch (error) {
    logger.error("[sendNewsletterSubscriptionEmail] error", {
      email,
      error: error.message,
    });
  }
};
