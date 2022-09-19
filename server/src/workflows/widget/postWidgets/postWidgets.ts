import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { createWidget } from "../../../modules/widgets/widgets.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { Widget } from "../../../schema/schemaWidget";
import { ThemeDoc } from "src/schema/schemaTheme";

export interface Request {
  name: string;
  themes: ThemeDoc[];
  typeContenu: ("dispositifs" | "demarches")[];
  languages: string[];
  location: {
    city: string;
    department: string;
  }
}

export const postWidgets = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[postWidgets] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    if (
      !req.body.name ||
      !req.body.themes || req.body.themes.length === 0 ||
      !req.body.typeContenu || req.body.typeContenu.length === 0
    ) throw new Error("INVALID_REQUEST");

    const widget = new Widget({
      name: req.body.name,
      themes: req.body.themes.map(t => t._id),
      typeContenu: req.body.typeContenu,
      author: req.userId
    });

    if (req.body.languages?.length) {
      widget.languages = req.body.languages;
    }
    if (req.body.location.city && req.body.location.department) {
      widget.location.city = req.body.location.city;
      widget.location.department = req.body.location.department;
    }
    const dbWidget = await createWidget(widget);

    return res.status(200).json({
      text: "Succès",
      data: dbWidget,
    });
  } catch (error) {
    logger.error("[postWidgets] error", { error: error.message });
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
