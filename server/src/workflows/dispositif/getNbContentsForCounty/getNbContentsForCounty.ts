import { GetNbContentsForCountyResponse } from "api-types/modules/dispositif";
import { isArray } from "lodash";
import { getActiveContents } from "src/modules/dispositif/dispositif.repository";
import { Dispositif } from "src/typegoose";

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const filterContentsOnGeoloc = (dispositifs: Dispositif[], county: string) => {
  const _county = removeAccents(county);
  return dispositifs.filter(
    (dispositif) =>
      (isArray(dispositif.metadatas?.location) &&
        dispositif.metadatas?.location.reduce(
          (acc, loc) => acc || removeAccents(loc).split(" - ")[1] === _county,
          false,
        )) ||
      false,
  );
};

const getNbContentsForCounty = (county: string): Promise<GetNbContentsForCountyResponse> =>
  getActiveContents({}).then((dispositifs) => {
    const nbLocalizedContent = filterContentsOnGeoloc(dispositifs, county).length;
    const nbGlobalContent =
      dispositifs /*.filter(
      (dispositif) => dispositif.metadatas.location === "france" || dispositif.metadatas.location === "online",
    )*/.length;
    return { nbLocalizedContent, nbGlobalContent };
  });

export default getNbContentsForCounty;
