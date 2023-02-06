import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getAllThemes } from "../../../modules/themes/themes.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

export interface Request {}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[getThemes] received");

    const themes = await getAllThemes();
    const activeLanguages = await getActiveLanguagesFromDB();

    return res.status(200).json({
      text: "Succès",
      data: themes.map((t) => ({ ...t.toObject(), active: t.isActive(activeLanguages) }))
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
