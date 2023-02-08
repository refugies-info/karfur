import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { deleteNeedById } from "../../../modules/needs/needs.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { getCountDispositifs, deleteNeedFromDispositifs } from "../../../modules/dispositif/dispositif.repository";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
  })
});

export interface Request {}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[deleteNeed] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdmin(req.user);

    // prevent from deleting if active dispositifs associated
    const activeDispositifs = await getCountDispositifs({
      status: { $ne: "Supprimé" },
      needs: req.params.id
    });
    if (activeDispositifs > 0) {
      throw new Error("INVALID_REQUEST");
    }

    // delete need from dispositifs if necessary
    await deleteNeedFromDispositifs(req.params.id);

    await deleteNeedById(req.params.id);

    return res.status(200).json({
      text: "Succès"
    });
  } catch (error) {
    logger.error("[deleteNeed] error", { error: error.message });
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
