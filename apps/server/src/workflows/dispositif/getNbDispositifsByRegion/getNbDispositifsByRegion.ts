import { GetRegionStatisticsResponse } from "@refugies-info/api-types";
import { ProjectionType } from "mongoose";
import logger from "~/logger";
import { adaptDispositifDepartement, getRegionFigures } from "~/modules/dispositif/dispositif.adapter";
import { getActiveDispositifsFromDBWithoutPopulate } from "~/modules/dispositif/dispositif.repository";
import { Dispositif } from "~/typegoose";
import { ResponseWithData } from "~/types/interface";

export const getNbDispositifsByRegion = async (): ResponseWithData<GetRegionStatisticsResponse> => {
  logger.info("[getNbDispositifsByRegion]");
  const neededFields: ProjectionType<Dispositif> = { metadatas: 1 };
  const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(neededFields);

  const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
  const dispositifsWithoutGeoloc = adaptedDispositifs
    .filter((dispositif) => dispositif.department === null)
    .map((dispo) => dispo._id);
  const regionFigures = getRegionFigures(adaptedDispositifs);

  return { text: "success", data: { regionFigures, dispositifsWithoutGeoloc } };
};
