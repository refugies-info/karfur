import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { deleteThemeById } from "../../../modules/themes/themes.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { AppUser } from "../../../schema/schemaAppUser";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
  })
});

export interface Request { }

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[deleteTheme] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    await deleteThemeById(req.params.id);
    await AppUser.updateMany({}, { $unset: { [`notificationsSettings.themes.${req.params.id}`]: 1 } });

    return res.status(200).json({
      text: "Succès"
    });
  } catch (error) {
    logger.error("[deleteTheme] error", { error: error.message });
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
