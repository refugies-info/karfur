import logger from "../../../logger";
import { cloneDeep, set } from "lodash";
import { DemarcheContent, DispositifContent, Languages, TranslationContent } from "@refugies-info/api-types";
import { addOrUpdateDispositifInContenusAirtable } from "../../../connectors/airtable/airtable";
import { deleteTradsInDB } from "../../../modules/traductions/traductions.repository";
import { getLanguageByCode } from "../../../modules/langues/langues.repository";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { sendPublishedTradMailToStructure } from "../../../modules/mail/sendPublishedTradMailToStructure";
import { sendNotificationsForDispositif } from "../../../modules/notifications/notifications.service";
import { Dispositif, DispositifModel, ErrorModel, Traductions, UserId } from "../../../typegoose";
import { sendPublishedTradMailToTraductors } from "../../../modules/mail/sendPublishedTradMailToTraductors";
import { deleteLineBreaks, deleteLineBreaksInInfosections } from "../../../modules/dispositif/dispositif.service";
import { log } from "./log";

const deleteLineBreaksInTranslation = (translation: Partial<TranslationContent>) => {
  const newTranslation = cloneDeep(translation);
  set(newTranslation, "content.what", deleteLineBreaks(newTranslation.content.what));
  set(newTranslation, "content.how", deleteLineBreaksInInfosections(newTranslation.content.how));

  const why = (newTranslation.content as DispositifContent).why;
  if (why) set(newTranslation, "content.why", deleteLineBreaksInInfosections(why));
  const next = (newTranslation.content as DemarcheContent).next;
  if (next) set(newTranslation, "content.next", deleteLineBreaksInInfosections(next));

  return newTranslation;
}

const validateTranslation = (dispositif: Dispositif, language: Languages, translation: Traductions) => {
  const isFirstValidation = !dispositif.translations[language]; // else, expert is just changing validated translation
  return DispositifModel.updateOne(
    { _id: dispositif._id },
    {
      $set: {
        [`translations.${language}`]: {
          ...deleteLineBreaksInTranslation(translation.translated),
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
        getLanguageByCode(language).then(langue => log(dispositif._id, translation.userId as UserId, langue._id)),
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
