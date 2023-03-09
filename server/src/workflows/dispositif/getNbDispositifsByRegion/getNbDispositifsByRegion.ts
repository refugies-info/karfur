import logger from "../../../logger";
import { getActiveDispositifsFromDBWithoutPopulate } from "../../../modules/dispositif/dispositif.repository";
import { ResponseWithData } from "../../../types/interface";
import { adaptDispositifDepartement, getRegionFigures } from "../../../modules/dispositif/dispositif.adapter";
import { GetRegionStatisticsResponse } from "api-types";

export const getNbDispositifsByRegion = async (): ResponseWithData<GetRegionStatisticsResponse> => {
  logger.info("[getNbDispositifsByRegion]");
  const neededFields = { metadatas: 1 };
  const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(neededFields);

  const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
  const dispositifsWithoutGeoloc = adaptedDispositifs
    .filter((dispositif) => dispositif.department === null)
    .map((dispo) => dispo._id);
  const regionFigures = getRegionFigures(adaptedDispositifs);

  return { text: "success", data: { regionFigures, dispositifsWithoutGeoloc } };
};
