import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { addOrUpdateDispositifInContenusAirtable } from "../../../controllers/miscellaneous/airtable";
import { validateTradInDB, deleteTradsInDB } from "../../../modules/traductions/traductions.repository";
import { insertInDispositif } from "../../../modules/dispositif/insertInDispositif";
import { updateLanguagesAvancement } from "../../../modules/langues/langues.service";
import { getLanguageByCode } from "../../../modules/langues/langues.repository";
import { getDispositifByIdWithAllFields } from "../../../modules/dispositif/dispositif.repository";
import { sendPublishedTradMailToStructure } from "../../../modules/mail/sendPublishedTradMailToStructure";
import { sendPublishedTradMailToTraductors } from "../../../modules/mail/sendPublishedTradMailToTraductors";
import { checkRequestIsFromSite, checkIfUserIsAdminOrExpert } from "../../../libs/checkAuthorizations";
import { asyncForEach } from "../../../libs/asyncForEach";
import { log } from "./log";
import { sendNotificationsForDispositif } from "../../../modules/notifications/notifications.service";
import { Dispositif, DispositifId, ErrorModel, Languages, TraductionId, Traductions } from "../../../typegoose";

interface Query {
  articleId: DispositifId;
  translatedText: Object;
  traductions: Traductions[]; // FIXME type API
  locale: Languages;
  _id: TraductionId;
}

const validateTranslations = async (req: RequestFromClientWithBody<Query>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    if (!req.body || !req.body.articleId || !req.body.translatedText) {
      throw new Error("INVALID_REQUEST");
    }
    checkIfUserIsAdminOrExpert(req.user);

    logger.info("[validateTranslations] received");
    try {
      let body = req.body;

      if (!body.traductions.length) {
        logger.info("[validateTranslations] validate the trad", {
          _id: body._id,
        });
        await validateTradInDB(body._id, req.userId);
      } else {
        await asyncForEach(body.traductions, async (trad) => {
          logger.info("[validateTranslations] validate trad", {
            _id: trad._id,
          });
          await validateTradInDB(trad._id, req.userId);
        });
      }
      // We delete all translations that are not from experts, since now we only need one official validated version
      await deleteTradsInDB(body.articleId, body.locale);

      const dispositifFromDB: Dispositif = await getDispositifByIdWithAllFields(body.articleId);

      // !IMPORTANT We insert the validated translation in the dispositif
      const { insertedDispositif, traductorIdsList } = await insertInDispositif(body, body.locale, dispositifFromDB);

      const language = await getLanguageByCode(body.locale);
      await log(dispositifFromDB._id, req.userId, language._id);

      try {
        await addOrUpdateDispositifInContenusAirtable(
          "",
          "",
          insertedDispositif.id,
          [],
          insertedDispositif.typeContenu,
          body.locale,
          insertedDispositif.getDepartements(),
          false,
        );
      } catch (error) {
        logger.error("[validateTranslations] error while updating contenu in airtable", {
          error,
        });
      }

      try {
        await sendNotificationsForDispositif(body.articleId, body.locale);
      } catch (error) {
        logger.error("[validateTranslations] error while sending notifications", error);
      }

      try {
        logger.info("[validateTranslations] updating avancement");
        await updateLanguagesAvancement();
      } catch (error) {
        logger.error("[validateTranslations] error while updating avancement", {
          error,
        });
      }

      if (insertedDispositif.typeContenu === "dispositif") {
        try {
          await sendPublishedTradMailToStructure(dispositifFromDB, body.locale);
        } catch (error) {
          logger.error("[validateTranslations] error while sending mails to structure members", {
            error: error.message,
          });
        }
      }

      try {
        // we do not want to send a mail to the expert
        const traductorNotExpertIdsList = traductorIdsList.filter(
          (tradId: string) => tradId && tradId.toString() !== req.userId.toString(),
        );
        await sendPublishedTradMailToTraductors(
          traductorNotExpertIdsList,
          body.locale,
          dispositifFromDB.typeContenu,
          dispositifFromDB.translations.fr.content.titreInformatif,
          dispositifFromDB.translations.fr.content.titreMarque,
          dispositifFromDB._id,
        );
      } catch (error) {
        logger.error("[validateTranslations] error while sending mails to traductors", {
          error: error.message,
        });
      }

      return res.status(200).json({
        text: "Succès",
      });
    } catch (err) {
      logger.error("[validateTranslations] error in validating, saving error to db", { error: err.message });
      await ErrorModel.create({
        name: "validateTradModifications",
        userId: req.userId,
        dataObject: {
          body: req.body,
        },
        error: err,
      });

      throw err;
    }
  } catch (error) {
    logger.error("[validateTranslations] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default validateTranslations;
