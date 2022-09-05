import { RequestFromClientWithBody, Res } from "../../../types/interface";

import {
  checkRequestIsFromSite,
  checkIfUserIsAdminOrExpert,
} from "../../../libs/checkAuthorizations";
import logger = require("../../../logger");
import { saveNeedInDB } from "../../../modules/needs/needs.repository";
import { Request, getValidator } from "../../../modules/needs/needs.service";
import { NeedDoc } from "../../../schema/schemaNeeds";

const validator = getValidator("patch");

const saveNeed = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[saveNeed] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    // @ts-ignore : populate roles
    checkIfUserIsAdminOrExpert(req.user.roles);

    if (!req.params.id) throw new Error("INVALID_REQUEST");

    const need: Partial<NeedDoc> = {
      fr: {
        text: req.body.fr.text,
        subtitle: req.body.fr.subtitle,
        //@ts-ignore
        updatedAt: Date.now()
      },
      image: req.body.image || null,
      theme: req.body.theme,
      adminComments: req.body.adminComments || ""
    };

    const dbNeed = await saveNeedInDB(req.params.id, need);

    return res.status(200).json({
      text: "OK",
      data: dbNeed
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

export default [validator, saveNeed];
