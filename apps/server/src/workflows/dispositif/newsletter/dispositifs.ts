import logger from "~/logger";
import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DispositifsData } from "~/workflows/dispositif/newsletter/types";

export const getNewsletterDispositifs = async (departement: string): ResponseWithData<DispositifsData> => {
  logger.info(`[getDispositifsForNewsletter] called for departement ${departement}`);

  const dispositifs = await getDispositifAbstracts({
    "typeContenu": "dispositif",
    "status": "Actif",
    "metadatas.location": `${departement}`,
    "lastModificationDate": { $exists: false },
  });

  const newest = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return { text: "success", data: { newest } };
};
