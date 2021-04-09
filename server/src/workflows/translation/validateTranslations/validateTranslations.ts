import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { ObjectId } from "mongoose";
import { TraductionDoc, Traduction } from "../../../schema/schemaTraduction";
import logger = require("../../../logger");
import ErrorDB from "../../../schema/schemaError";
import {
  checkRequestIsFromSite,
  checkIfUserIsAdminOrExpert,
} from "../../../libs/checkAuthorizations";
import {
  validateTradInDB,
  deleteTradsInDB,
} from "../../../modules/traductions/traductions.repository";
import { insertInDispositif } from "../../../modules/traductions/insertInDispositif";
import { asyncForEach } from "../../../libs/asyncForEach";

interface Query {
  articleId: ObjectId;
  translatedText: Object;
  traductions: TraductionDoc[];
  locale: string;
  _id: ObjectId;
}
export const validateTranslations = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);
    if (!req.body || !req.body.articleId || !req.body.translatedText) {
      throw new Error("INVALID_REQUEST");
    }
    // @ts-ignore : populate roles
    checkIfUserIsAdminOrExpert(req.user.roles);
    logger.info("[validateTranslations] received", { body: req.body });
    try {
      let traductionUser = req.body;

      if (!traductionUser.traductions.length) {
        await validateTradInDB(traductionUser._id, req.userId);
      } else {
        await asyncForEach(traductionUser.traductions, async (trad) => {
          await validateTradInDB(trad._id, req.userId);
        });
      }
      // We delete all translations that are not from experts, since now we only need one official validated version
      await deleteTradsInDB(traductionUser.articleId, traductionUser.locale);

      // !IMPORTANT We insert the validated translation in the dispositif
      insertInDispositif(res, traductionUser, traductionUser.locale);
    } catch (err) {
      logger.error("error validateTrad for review", { error: err.message });
      new ErrorDB({
        name: "validateTradModifications",
        userId: req.userId,
        dataObject: {
          body: req.body,
        },
        error: err,
      }).save();

      res.status(500).json({
        text: "Erreur interne",
      });
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
