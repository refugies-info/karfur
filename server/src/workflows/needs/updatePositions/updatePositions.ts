import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { updatePositions } from "../../../modules/needs/needs.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { NeedId } from "src/typegoose";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    orderedNeedIds: Joi.array().items(Joi.string())
  })
});

export interface Request {
  orderedNeedIds: NeedId[];
}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[updatePositions] received");
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdmin(req.user);

    const data = await updatePositions(req.body.orderedNeedIds);

    return res.status(200).json({
      text: "Succès",
      data
    });
  } catch (error) {
    logger.error("[updatePositions] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Création interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
