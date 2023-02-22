import logger from "../../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { deleteTradsInDB } from "../../../modules/traductions/traductions.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { sendPublishedTradMailToStructure } from "../../../modules/mail/sendPublishedTradMailToStructure";
import { sendNotificationsForDispositif } from "../../../modules/notifications/notifications.service";
import { Dispositif, DispositifModel, ErrorModel, Traductions } from "../../../typegoose";
import { Languages } from "api-types";

const validateTranslation = (dispositif: Dispositif, language: Languages, translation: Traductions) =>
  DispositifModel.updateOne({ _id: dispositif._id }, { $set: { [`translations.${language}`]: translation } })
    .then(() =>
      /*
       * Une fois la traduction publiée
       * il faut executer un certain nombre d'actions
       */
      Promise.all([
        deleteTradsInDB(dispositif._id, language),
        addOrUpdateDispositifInContenusAirtable(
          "",
          "",
          dispositif._id,
          [],
          dispositif.typeContenu,
          language,
          dispositif.getDepartements(),
          false,
        ).catch((error) => {
          logger.error("[validateTranslations] error while updating contenu in airtable", {
            error,
          });
        }),
        sendNotificationsForDispositif(dispositif._id, language).catch((error) => {
          logger.error("[validateTranslations] error while sending notifications", error);
        }),
        updateLanguagesAvancement(),
        dispositif.isDispositif()
          ? sendPublishedTradMailToStructure(dispositif, language).catch((error) => {
              logger.error("[validateTranslations] error while sending mails to structure members", {
                error: error.message,
              });
            })
          : null,
      ]),
    )
    .catch(async (err) => {
      logger.error("[validateTranslations] error in validating, saving error to db", { error: err.message });
      await ErrorModel.create({
        name: "validateTradModifications",
        error: err,
      });

      throw err;
    });

export default validateTranslation;
