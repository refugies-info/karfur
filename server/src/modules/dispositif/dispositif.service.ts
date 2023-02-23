import { updateDispositifInDB } from "./dispositif.repository";
import { updateLanguagesAvancement } from "../langues/langues.service";
import logger from "../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";
import { sendMailWhenDispositifPublished } from "../mail/sendMailWhenDispositifPublished";
import { sendNotificationsForDispositif } from "../../modules/notifications/notifications.service";
import { Dispositif, DispositifId, UserId } from "../../typegoose";

export const publishDispositif = async (dispositifId: DispositifId, userId: UserId) => {
  const newDispositif = {
    status: "Actif" as Dispositif["status"],
    publishedAt: new Date(),
    publishedAtAuthor: userId
  };

  const newDispo = await updateDispositifInDB(dispositifId, newDispositif);
  try {
    await updateLanguagesAvancement();
  } catch (error) {
    logger.error("[publishDispositif] error while updating languages avancement", { error: error.message });
  }

  const themesList = [newDispo.getTheme(), ...newDispo.getSecondaryThemes()].map((t) => t.short.fr);

  try {
    await addOrUpdateDispositifInContenusAirtable(
      newDispo.translations.fr.content.titreInformatif,
      newDispo.translations.fr.content.titreMarque,
      newDispo._id,
      themesList,
      newDispo.typeContenu,
      null,
      newDispo.getDepartements(),
      false
    );
  } catch (error) {
    logger.error("[publishDispositif] error while updating contenu in airtable", { error: error.message });
  }

  try {
    await sendNotificationsForDispositif(dispositifId, "fr");
  } catch (error) {
    logger.error("[publishDispositif] error while sending notifications", error);
  }

  try {
    await sendMailWhenDispositifPublished(newDispo);
  } catch (error) {
    logger.error("[publishDispositif] error while sending email", {
      error: error.message
    });
  }
};
