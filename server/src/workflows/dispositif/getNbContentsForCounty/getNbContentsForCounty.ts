import { DispositifStatus, GetContentsForAppRequest, GetNbContentsForCountyResponse } from "@refugies-info/api-types";
import { getCountDispositifs } from "../../../modules/dispositif/dispositif.repository";
import getFilteredContentsForApp from "../getFilteredContentsForApp";

const getNbContentsForCounty = (request: GetContentsForAppRequest): Promise<GetNbContentsForCountyResponse> =>
  Promise.all([
    getFilteredContentsForApp(request).then((dispositifs) => dispositifs.length),
    getCountDispositifs({
      $and: [
        {
          webOnly: false,
          status: DispositifStatus.ACTIVE,
        },
        {
          $or: [
            { "metadatas.location": { $exists: false } },
            { "metadatas.location": { $eq: "france" } },
            { "metadatas.location": { $eq: "online" } },
          ],
        },
      ],
    }),
  ]).then(([nbLocalizedContent, nbGlobalContent]) => ({
    nbLocalizedContent,
    nbGlobalContent,
  }));

export default getNbContentsForCounty;
