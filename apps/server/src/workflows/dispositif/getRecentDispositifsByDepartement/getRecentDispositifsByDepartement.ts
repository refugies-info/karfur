import logger from "~/logger";
import { getLatestDispositifs } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";

const frontUrl = process.env.FRONT_SITE_URL || "https://refugies.info";

export const getRecentDispositifsByDepartement = async (
  departement: string,
): ResponseWithData<{ titre: string; url: string }[]> => {
  logger.info(`[getRecentDispositifsByDepartement] called for departement ${departement}`);

  const dispositifs = await getLatestDispositifs({
    "typeContenu": "dispositif",
    "status": "Actif",
    "metadatas.location": { $regex: `^${departement}\\s-` },
  });

  const result = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
  }));

  return { text: "success", data: result };
};
