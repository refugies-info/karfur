import logger from "../../logger";
import { Res } from "../../types/interface";
import { getActiveDispositifsFromDBWithoutPopulate } from "./dispositif.repository";
import {
  adaptDispositifDepartement,
  getRegionFigures,
} from "./dispositif.adapter";

export const getNbDispositifsByRegion = async (req: {}, res: Res) => {
  try {
    logger.info("[getNbDispositifsByRegion]");
    const neededFields = { contenu: 1 };
    const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(
      neededFields
    );

    const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
    const dispositifsWithoutGeoloc = adaptedDispositifs
      .filter((dispositif) => dispositif.department === "No geoloc")
      .map((dispo) => dispo._id);
    const regionFigures = getRegionFigures(adaptedDispositifs);
    return res
      .status(200)
      .json({ text: "OK", data: { regionFigures, dispositifsWithoutGeoloc } });
  } catch (error) {
    logger.error("[getNbDispositifsByRegion] error", { error: error.message });
    return res.status(500).json({ text: "Erreur" });
  }
};
