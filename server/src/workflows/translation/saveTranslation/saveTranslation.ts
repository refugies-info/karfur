import { addOrUpdateDispositifInContenusAirtable } from "src/controllers/miscellaneous/airtable";
import logger from "src/logger";
import { getDispositifById } from "src/modules/dispositif/dispositif.repository";
import { updateLanguagesAvancement } from "src/modules/langues/langues.service";
import { sendPublishedTradMailToStructure } from "src/modules/mail/sendPublishedTradMailToStructure";
import { sendNotificationsForDispositif } from "src/modules/notifications/notifications.service";
import { deleteTradsInDB } from "src/modules/traductions/traductions.repository";
import {
  DispositifModel,
  ErrorModel,
  Id,
  IndicatorModel,
  Languages,
  RichText,
  Traductions,
  TraductionsModel,
  User,
} from "src/typegoose";
import { Content, Dispositif, InfoSection, InfoSections } from "src/typegoose/Dispositif";

export interface SaveTranslationRequest {
  dispositifId: string;
  language: Languages;
  timeSpent: number;
  translated: Partial<{
    content: Partial<Content> & {
      what?: RichText;
      why?: { [key: string]: Partial<InfoSection> };
      how?: { [key: string]: Partial<InfoSection> };
      next?: InfoSections;
    };
    metadatas: Partial<{
      important?: string;
      duration?: string;
    }>;
  }>;
}

const validateTranslation = (dispositif: Dispositif, language: Languages, translation: Traductions) =>
  DispositifModel.updateOne({ _id: dispositif._id }, { $set: { [`translations.${language}`]: translation } })
    .then(() =>
      /*
       * Une fois la traduction publiée
       * il faut executer un certain nombre d'actions
       */
      Promise.all([
        // deleteTradsInDB(dispositif._id, language),
        async () => {
          console.log("deleteTradsInDB", dispositif._id, language);
        },
        // addOrUpdateDispositifInContenusAirtable(
        //   "",
        //   "",
        //   dispositif._id,
        //   [],
        //   dispositif.typeContenu,
        //   language,
        //   dispositif.getDepartements(),
        //   false,
        // ).catch((error) => {
        //   logger.error("[validateTranslations] error while updating contenu in airtable", {
        //     error,
        //   });
        // }),
        sendNotificationsForDispositif(dispositif._id, language).catch((error) => {
          logger.error("[validateTranslations] error while sending notifications", error);
        }),
        updateLanguagesAvancement(),
        dispositif.typeContenu === "dispositif"
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

const saveTranslation = (
  { timeSpent, language, dispositifId, translated }: SaveTranslationRequest,
  user: User,
): Promise<Traductions> =>
  getDispositifById(dispositifId).then(async (dispositif) => {
    if (dispositif.isTranslatedIn(language)) {
      throw new Error(`Dispositif is already translated in ${language}`);
    }

    const _traduction = new Traductions();
    _traduction.dispositifId = new Id(dispositifId);
    _traduction.language = language;
    // @ts-ignore
    _traduction.translated = translated;
    _traduction.type = user.isExpert() ? "validation" : "suggestion";
    _traduction.userId = user._id;

    // TODO meilleur calcul de l'avancement car si l'une des sous-parties n'est pas traduite (un titre de how mais pas un text)
    // cela peut faire comme si la traduction était complètement traduite => ce n'est pas le cas
    _traduction.avancement = Traductions.computeAvancement(dispositif, _traduction);
    if (user.isExpert()) _traduction.validatorId = user._id;

    const wordsCount = _traduction.countWords();

    // We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
    await IndicatorModel.create({
      userId: user._id,
      dispositifId,
      language,
      timeSpent,
      wordsCount,
    });

    /**
     * Si l'avancement est à 100% + faite par un expert => traduction prête
     *
     * Alors il faut publier la traduction de la fiche
     * puis supprimer l'ensemble des traductions.
     */
    // return _traduction.avancement >= 1 && user.isExpert()
    //   ? validateTranslation(dispositif, language, _traduction).then(() => _traduction)
    //   : TraductionsModel.findOneAndUpdate(
    //       { dispositifId, userId: user._id, language },
    //       { ..._traduction, $inc: { timeSpent } },
    //       {
    //         upsert: true,
    //         setDefaultsOnInsert: true,
    //         returnDocument: "after",
    //         returnNewDocument: true,
    //       },
    //     ).then((trad) => trad.toObject());
    return TraductionsModel.findOneAndUpdate(
      { dispositifId, userId: user._id, language },
      { ..._traduction, $inc: { timeSpent } },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnDocument: "after",
        returnNewDocument: true,
      },
    ).then((trad) => trad.toObject());
  });

export default saveTranslation;
