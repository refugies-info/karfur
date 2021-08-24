import { Res } from "../../../types/interface";

import logger from "../../../logger";
import { getNeedsFromDB } from "../../../modules/needs/needs.repository";

export const getNeeds = async (req: {}, res: Res) => {
  try {
    logger.info("[getNeeds] get needs");

    const needs = await getNeedsFromDB();

    return res.status(200).json({ data: needs });
  } catch (error) {
    logger.error("[getNeeds] error", { error: error.message });
    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
