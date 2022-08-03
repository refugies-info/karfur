import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getAdminOption, createAdminOption, updateAdminOption } from "../../../modules/adminOptions/adminOptions.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { AdminOption } from "../../../schema/schemaAdminOption";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    key: Joi.string(),
  }),
  [Segments.BODY]: Joi.object().keys({
    value: Joi.any(),
  })
});

export interface Request {
  value: any
}

export const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[postAdminOptions] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    let updatedAdminOption = null;
    const adminOption = await getAdminOption(req.params.key);
    if (adminOption) {
      updatedAdminOption = await updateAdminOption(req.params.key, req.body.value);
    } else {
      const newOption = new AdminOption({
        key: req.params.key,
        value: req.body.value
      });
      updatedAdminOption = await createAdminOption(newOption);
    }

    return res.status(200).json({
      text: "Succès",
      data: updatedAdminOption,
    });
  } catch (error) {
    logger.error("[postAdminOptions] error", { error: error.message });
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
