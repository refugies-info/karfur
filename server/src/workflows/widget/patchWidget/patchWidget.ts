import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { updateWidget } from "../../../modules/widgets/widgets.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { WidgetDoc } from "../../../schema/schemaWidget";

export interface Request {
  name: string;
  tags: string[];
  typeContenu: "dispositif" | "demarche"[];
  languages: ObjectId[];
  city: string;
  department: string;
}

export const patchWidget = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[patchWidget] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    if (!req.params.id) throw new Error("INVALID_REQUEST");

    const widget: Partial<WidgetDoc> = {
      author: req.userId
    };

    if (req.body.typeContenu?.length) {
      widget.typeContenu = req.body.typeContenu;
    }
    if (req.body.tags?.length) {
      widget.tags = req.body.tags;
    }
    if (req.body.languages?.length) {
      widget.languages = req.body.languages;
    }
    if (req.body.city && req.body.department) {
      widget.location.city = req.body.city;
      widget.location.department = req.body.department;
    }
    const dbWidget = await updateWidget(req.params.id, widget);

    return res.status(200).json({
      text: "Succès",
      data: dbWidget,
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
