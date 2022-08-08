import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { createTheme } from "../../../modules/themes/themes.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { Theme } from "../../../schema/schemaTheme";
import { Request, getValidator } from "../../../modules/themes/themes.service";

const validator = getValidator("post");

const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[postThemes] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    const theme = new Theme({
      name: req.body.name,
      short: req.body.short,
      colors: req.body.colors,
      position: req.body.position,
      icon: req.body.icon,
      banner: req.body.banner,
      appImage: req.body.appImage,
      shareImage: req.body.shareImage,
    });

    const dbTheme = await createTheme(theme);

    return res.status(200).json({
      text: "Succès",
      data: dbTheme,
    });
  } catch (error) {
    logger.error("[postThemes] error", { error: error.message });
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
