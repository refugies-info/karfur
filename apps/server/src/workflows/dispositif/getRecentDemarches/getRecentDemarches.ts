import logger from "~/logger";
import { getLatestDispositifs } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";

const frontUrl = process.env.FRONT_SITE_URL || "https://refugies.info";

export const getRecentDemarches = async (): ResponseWithData<{ titre: string; url: string }[]> => {
  logger.info("[getRecentDemarches] called");

  const dispositifs = await getLatestDispositifs({
    typeContenu: "demarche",
    status: "Actif",
  });

  const result = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
  }));

  return { text: "success", data: result };
};
