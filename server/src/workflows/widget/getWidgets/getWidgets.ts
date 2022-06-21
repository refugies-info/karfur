import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getAllWidgets } from "../../../modules/widgets/widgets.repository";
import {
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";

export interface Request {
}

export const getWidgets = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[getWidgets] received");
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles)

    const widgets = await getAllWidgets();
    return res.status(200).json({
      text: "Succès",
      data: widgets,
    });
  } catch (error) {
    logger.error("[getWidgets] error", { error: error.message });
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
