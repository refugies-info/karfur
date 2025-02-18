import logger from "~/logger";
import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DispositifsData } from "~/workflows/dispositif/newsletter/types";

export const getLatestPublications = async (departement: string): ResponseWithData<DispositifsData> => {
  logger.info(`[getDispositifsForNewsletter] called for departement ${departement}`);

  const dispositifs = await getDispositifAbstracts(
    {
      "typeContenu": "dispositif",
      "status": "Actif",
      "metadatas.location": `${departement}`,
      "publishedAt": { $exists: true },
    },
    3,
    {
      publishedAt: -1,
    },
  );

  const publications = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return { text: "success", data: { publications } };
};
