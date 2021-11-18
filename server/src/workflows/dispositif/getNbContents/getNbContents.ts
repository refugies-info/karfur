import logger from "../../../logger";
import { getActiveContents } from "../../../modules/dispositif/dispositif.repository";
import { Res, RequestFromClient } from "../../../types/interface";
import {
  filterContentsOnGeoloc,
} from "../../../modules/dispositif/dispositif.adapter";

interface Query {
  department: string;
}

export const getNbContents = async (req: RequestFromClient<Query>, res: Res) => {
  try {
    if (!req.query || !req.query.department) {
      throw new Error("INVALID_REQUEST");
    }

    const { department } = req.query;
    logger.info("[getNbDispositifs]", {
      department,
    });

    const neededFields = { contenu: 1 };
    const activeDispositifs = await getActiveContents(
      neededFields
    );

    const nbLocalizedContent = filterContentsOnGeoloc(activeDispositifs, department, true).length;
    const nbGlobalContent = filterContentsOnGeoloc(activeDispositifs, "All", false).length;

    return res
      .status(200)
      .json({ text: "OK", data: { nbLocalizedContent, nbGlobalContent } });
  } catch (error) {
    logger.error("[getNbDispositifs] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
