import type {
  DemarcheContent,
  DispositifContent,
  Languages,
  TranslationContent,
} from "@refugies-info/api-types";
import {
  type Dispositif,
  DispositifModel,
  ErrorModel,
  type Traductions,
  type UserId,
} from "@refugies-info/mongo";
import { cloneDeep, set } from "lodash";
import logger from "~/logger";
import { isDispositif } from "~/modules/dispositif/dispositif.business";
import {
  deleteLineBreaks,
  deleteLineBreaksInInfosections,
} from "~/modules/dispositif/dispositif.service";
import { getLanguageByCode } from "~/modules/langues/langues.repository";
import { updateLanguagesAvancement } from "~/modules/langues/langues.service";
import { sendPublishedTradMailToStructure } from "~/modules/mail/sendPublishedTradMailToStructure";
import { sendPublishedTradMailToTraductors } from "~/modules/mail/sendPublishedTradMailToTraductors";
import { sendDispositifNotifications } from "~/modules/notifications/notifications.service";
import { deleteTradsInDB } from "~/modules/traductions/traductions.repository";
import { addTradToAirtable } from "~/modules/traductions/traductions.service";
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
};

const validateTranslation = (
  dispositif: Dispositif,
  language: Languages,
  translation: Traductions,
  username: string,
) => {
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
        getLanguageByCode(language).then((langue) =>
          log(dispositif._id, translation.userId as UserId, langue._id),
        ),
        isFirstValidation ? addTradToAirtable(dispositif, language, translation, username) : null,
        isFirstValidation
          ? sendDispositifNotifications(dispositif._id, language).catch((error) => {
              logger.error("[validateTranslations] error while sending notifications", error);
            })
          : null,
        isFirstValidation ? updateLanguagesAvancement() : null,
        isDispositif(dispositif) && isFirstValidation
          ? sendPublishedTradMailToStructure(dispositif, language).catch((error) => {
              logger.error(
                "[validateTranslations] error while sending mails to structure members",
                {
                  error: error.message,
                },
              );
            })
          : null,
        isFirstValidation ? sendPublishedTradMailToTraductors(language, dispositif) : null,
      ]),
    )
    .catch(async (err) => {
      logger.error("[validateTranslations] error in validating, saving error to db", {
        error: err.message,
      });
      await ErrorModel.create({
        name: "validateTradModifications",
        error: err,
      });

      throw err;
    });
};
export default validateTranslation;
