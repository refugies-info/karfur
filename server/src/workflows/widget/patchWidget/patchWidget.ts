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
  location: {
    city: string;
    department: string;
  }
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
      author: req.userId,
      typeContenu: req.body.typeContenu,
      tags: req.body.tags,
      languages: req.body.languages,
      location: {
        city: req.body.location.city,
        department: req.body.location.department
      }
    };

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
