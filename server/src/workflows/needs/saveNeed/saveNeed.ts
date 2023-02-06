import { RequestFromClientWithBody, Res } from "../../../types/interface";

import { checkRequestIsFromSite, checkIfUserIsAdminOrExpert } from "../../../libs/checkAuthorizations";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import { Request, getValidator } from "../../../modules/needs/needs.service";
import logger from "src/logger";
import { Need } from "src/typegoose";

const validator = getValidator("patch");

const saveNeed = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[saveNeed] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdminOrExpert(req.user);

    if (!req.params.id) throw new Error("INVALID_REQUEST");

    const oldNeed = await getNeedFromDB(req.params.id);
    const need: Partial<Need> = { ...req.body };

    // edit french version
    if (need.fr) {
      const isFrenchTextEdited =
        (need.fr.text && need.fr.text !== oldNeed.fr.text) ||
        (need.fr.subtitle && need.fr.subtitle !== oldNeed.fr.subtitle);
      need.fr.updatedAt = isFrenchTextEdited ? new Date() : oldNeed.fr.updatedAt;
    }

    const dbNeed = await saveNeedInDB(req.params.id, need);

    return res.status(200).json({
      text: "OK",
      data: dbNeed
    });
  } catch (error) {
    logger.error("[saveNeed] error", {
      error: error.message
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "USER_NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Modification interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, saveNeed];
