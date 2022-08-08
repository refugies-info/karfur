import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getAllThemes } from "../../../modules/themes/themes.repository";

export interface Request {
}

const handler = async (
  req: RequestFromClientWithBody<Request>,
  res: Res
) => {
  try {
    logger.info("[getThemes] received");

    const themes = await getAllThemes();
    return res.status(200).json({
      text: "Succès",
      data: themes,
    });
  } catch (error) {
    logger.error("[getThemes] error", { error: error.message });
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

export default [handler];
