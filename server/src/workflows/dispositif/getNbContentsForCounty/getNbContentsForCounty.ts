import { DispositifStatus } from "api-types";
import { GetNbContentsForCountyResponse } from "api-types/modules/dispositif";
import { getCountDispositifs } from "../../../modules/dispositif/dispositif.repository";

const getNbContentsForCounty = (county: string): Promise<GetNbContentsForCountyResponse> =>
  Promise.all([
    getCountDispositifs({
      $and: [
        {
          status: DispositifStatus.ACTIVE,
        },
        { "metadatas.location": { $regex: ` - ${county}$` } },
      ],
    }),
    getCountDispositifs({
      $and: [
        {
          status: DispositifStatus.ACTIVE,
        },
        { $or: [{ "metadatas.location": { $exists: false } }, { "metadatas.location": { $eq: "All" } }] },
        // TODO {$or: [{ "metadatas.location": { $eq: "france" } },
        // TODO { "metadatas.location": { $eq: "online" } }]}
      ],
    }),
  ]).then(([nbLocalizedContent, nbGlobalContent]) => ({
    nbLocalizedContent,
    nbGlobalContent,
  }));

export default getNbContentsForCounty;
