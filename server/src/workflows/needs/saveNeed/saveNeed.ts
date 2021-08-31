import { RequestFromClientWithBody, Res, Need } from "../../../types/interface";

import {
  checkRequestIsFromSite,
  checkIfUserIsAdminOrExpert,
} from "../../../libs/checkAuthorizations";
import logger = require("../../../logger");
import { saveNeedInDB } from "../../../modules/needs/needs.repository";

interface Query {
  query: Partial<Need>;
}
export const saveNeed = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    // @ts-ignore : populate roles
    checkIfUserIsAdminOrExpert(req.user.roles);

    if (!req.body.query) {
      throw new Error("INVALID_REQUEST");
    }

    const need = req.body.query;

    await saveNeedInDB(need);

    return res.status(200).json({
      text: "OK",
    });
  } catch (error) {
    logger.error("[saveNeed] error", {
      error: error.message,
    });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "USER_NOT_AUTHORIZED":
        return res.status(401).json({ text: "Token invalide" });
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
