import logger from "~/logger";
import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DemarchesData, DispositifDesc } from "~/workflows/dispositif/newsletter/types";

const getLatestPublications = async (): Promise<DispositifDesc> => {
  logger.info("[getNewestDemarche] called");

  const dispositifs = await getDispositifAbstracts(
    {
      typeContenu: "demarche",
      status: "Actif",
      publishedAt: { $exists: true },
    },
    3,
    {
      publishedAt: -1,
    },
  );

  const publications = {
    titre: dispositifs[0].titreInformatif,
    url: `${frontUrl}/fr/${dispositifs[0].typeContenu}/${dispositifs[0]._id}`,
    abstract: dispositifs[0].abstract,
  };

  return publications;
};

const getLatestUpdates = async (): Promise<DispositifDesc[]> => {
  logger.info("[getUpdatedDemarches] called");

  const dispositifs = await getDispositifAbstracts(
    {
      typeContenu: "demarche",
      status: "Actif",
      lastModificationDate: { $exists: true },
    },
    3,
    {
      lastModificationDate: -1,
    },
  );

  const updates = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return updates;
};

export const getNewsletterDemarches = async (): ResponseWithData<DemarchesData> => {
  logger.info("[getDemarchesForNewsletter] called");

  const publications = await getLatestPublications();

  const updates = await getLatestUpdates();

  return { text: "success", data: { publications, updates } };
};
