import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
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

export const patchWidget = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[patchWidget] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdmin(req.user);

    if (!req.params.id) throw new Error("INVALID_REQUEST");

    const widget: Partial<Widget> = {
      author: req.userId,
      typeContenu: req.body.typeContenu,
      themes: req.body.themes.map((t) => t._id),
      languages: req.body.languages,
      department: req.body.department
    };

    const dbWidget = await updateWidget(req.params.id, widget);

    return res.status(200).json({
      text: "Succès",
      data: dbWidget
    });
  } catch (error) {
    logger.error("[patchWidget] error", { error: error.message });
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
