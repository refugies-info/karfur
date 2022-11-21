import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { updateUserInDB } from "../../../modules/users/users.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { USER_STATUS_DELETED } from "../../../schema/schemaUser";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string(),
  })
});

export interface Request { }

const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[deleteUser] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    await updateUserInDB(req.params.id, {
      status: USER_STATUS_DELETED
    });

    return res.status(200).json({
      text: "Succès",
    });
  } catch (error) {
    logger.error("[deleteUser] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Suppression interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
