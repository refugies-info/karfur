import logger from "../../../logger";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { deleteTradsInDB } from "../../../modules/traductions/traductions.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { sendPublishedTradMailToStructure } from "../../../modules/mail/sendPublishedTradMailToStructure";
import { sendNotificationsForDispositif } from "../../../modules/notifications/notifications.service";
import { Dispositif, DispositifModel, ErrorModel, Traductions } from "../../../typegoose";
import { Languages } from "@refugies-info/api-types";
import { sendPublishedTradMailToTraductors } from "../../../modules/mail/sendPublishedTradMailToTraductors";

const validateTranslation = (dispositif: Dispositif, language: Languages, translation: Traductions) => {
  const isFirstValidation = !dispositif.translations[language]; // else, expert is just changing validated translation
  return DispositifModel.updateOne(
    { _id: dispositif._id },
    {
      $set: {
        [`translations.${language}`]: {
          ...translation.translated,
          created_at: new Date(),
          validatorId: translation.userId,
        },
      },
    },
  )
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
        isFirstValidation ? sendNotificationsForDispositif(dispositif._id, language).catch((error) => {
          logger.error("[validateTranslations] error while sending notifications", error);
        }) : null,
        isFirstValidation ? updateLanguagesAvancement() : null,
        dispositif.isDispositif() && isFirstValidation
          ? sendPublishedTradMailToStructure(dispositif, language).catch((error) => {
            logger.error("[validateTranslations] error while sending mails to structure members", {
              error: error.message,
            });
          })
          : null,
        isFirstValidation ? sendPublishedTradMailToTraductors(
          language,
          dispositif
        ) : null
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
}
export default validateTranslation;
