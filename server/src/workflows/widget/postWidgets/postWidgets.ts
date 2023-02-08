import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { createWidget } from "../../../modules/widgets/widgets.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { Theme, Widget } from "src/typegoose";
export interface Request {
  name: string;
  themes: Theme[];
  typeContenu: ("dispositif" | "demarche")[];
  languages: string[];
  department: string;
}

export const postWidgets = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[postWidgets] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdmin(req.user);

    if (
      !req.body.name ||
      !req.body.themes ||
      req.body.themes.length === 0 ||
      !req.body.typeContenu ||
      req.body.typeContenu.length === 0
    )
      throw new Error("INVALID_REQUEST");

    const widget = new Widget();
    widget.name = req.body.name;
    widget.themes = req.body.themes.map((t) => t._id);
    widget.typeContenu = req.body.typeContenu;
    widget.author = req.userId;

    if (req.body.languages?.length) {
      widget.languages = req.body.languages;
    }
    if (req.body.department) {
      widget.department = req.body.department;
    }
    const dbWidget = await createWidget(widget);

    return res.status(200).json({
      text: "Succès",
      data: dbWidget
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
