import { Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";

export const getLanguages = async (req: {}, res: Res) => {
  try {
    logger.info("[getLanguages] received");
    const activeLanguages = await getActiveLanguagesFromDB();
    const result = activeLanguages.map((langue) => {
      if (langue.avancementTrad && langue.avancementTrad > 1) {
        langue.avancementTrad = 1;
        return langue;
      }

      return langue;
    });

    return res.status(200).json({
      text: "Succès",
      data: result,
    });
  } catch (error) {
    logger.error("[getLanguages] error", { error: error.message });
    return res.status(500).json({ text: "Erreur interne" });
  }
};
