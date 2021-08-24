import { Res } from "../../../types/interface";
import logger = require("../../../logger");

export const addNeedsFromAirtable = async (req: {}, res: Res) => {
  try {
    logger.info("[addNeedsFromAirtable]");
    let results: any[] = [];

    return res.status(200).json({ text: "ok" });
  } catch (error) {
    logger.error("[addNeedsFromAirtable] error ", {
      error: error.message,
    });

    return res.status(500).json({
      text: "Erreur interne",
    });
  }
};
