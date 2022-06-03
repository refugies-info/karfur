import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { deleteWidgetById } from "../../../modules/widgets/widgets.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

export interface Request {}

export const deleteWidget = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[deleteWidget] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    if (!req.params.id) throw new Error("INVALID_REQUEST");

    await deleteWidgetById(req.params.id);

    return res.status(200).json({
      text: "Succès",
    });
  } catch (error) {
    logger.error("[deleteWidget] error", { error: error.message });
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
