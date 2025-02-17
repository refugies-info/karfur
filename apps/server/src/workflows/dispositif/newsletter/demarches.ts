import logger from "~/logger";
import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DemarchesData, DispositifDesc } from "~/workflows/dispositif/newsletter/types";

const getNewestDemarche = async (): Promise<DispositifDesc> => {
  logger.info("[getNewestDemarche] called");

  const dispositifs = await getDispositifAbstracts(
    {
      typeContenu: "demarche",
      status: "Actif",
      lastModificationDate: { $exists: false },
    },
    1,
  );

  const newest = {
    titre: dispositifs[0].titreInformatif,
    url: `${frontUrl}/fr/${dispositifs[0].typeContenu}/${dispositifs[0]._id}`,
    abstract: dispositifs[0].abstract,
  };

  return newest;
};

const getUpdatedDemarches = async (): Promise<DispositifDesc[]> => {
  logger.info("[getUpdatedDemarches] called");

  const dispositifs = await getDispositifAbstracts({
    typeContenu: "demarche",
    status: "Actif",
    lastModificationDate: { $exists: true },
  });

  const updated = dispositifs.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return updated;
};

export const getNewsletterDemarches = async (): ResponseWithData<DemarchesData> => {
  logger.info("[getDemarchesForNewsletter] called");

  const newest = await getNewestDemarche();

  const updated = await getUpdatedDemarches();

  return { text: "success", data: { newest, updated } };
};
