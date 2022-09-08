import { RequestFromClientWithBody, Res } from "../../../types/interface";

import {
  checkRequestIsFromSite,
  checkIfUserIsAdmin,
} from "../../../libs/checkAuthorizations";
import logger = require("../../../logger");
import { createNeedInDB } from "../../../modules/needs/needs.repository";
import { Request, getValidator } from "../../../modules/needs/needs.service";
import { NeedDoc } from "../../../schema/schemaNeeds";

const validator = getValidator("post");

const createNeed = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[createNeed] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    // @ts-ignore : populate roles
    checkIfUserIsAdmin(req.user.roles);

    const need = req.body;

    const needDB: Partial<NeedDoc> = {
      fr: {
        text: need.fr.text,
        subtitle: need.fr.subtitle,
        //@ts-ignore
        updatedAt: Date.now()
      },
      image: need.image || null,
      theme: need.theme,
      adminComments: need.adminComments || "",
      position: 0
    };

    await createNeedInDB(needDB);

    return res.status(200).json({
      text: "OK",
    });
  } catch (error) {
    logger.error("[createNeed] error", {
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

export default [validator, createNeed];
