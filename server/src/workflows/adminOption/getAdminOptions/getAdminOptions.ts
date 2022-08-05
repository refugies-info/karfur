import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getAdminOption } from "../../../modules/adminOptions/adminOptions.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    key: Joi.string(),
  })
});

export interface Request {
}

const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[getAdminOptions] received");
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    const adminOption = await getAdminOption(req.params.key);
    return res.status(200).json({
      text: "Succès",
      data: adminOption,
    });
  } catch (error) {
    logger.error("[getAdminOptions] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Lecture interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler]
