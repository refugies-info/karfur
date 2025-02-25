import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DemarchesData, DispositifDesc } from "~/workflows/dispositif/newsletter/types";

const getPublications = async (): Promise<DispositifDesc[]> => {
  const results = await getDispositifAbstracts(
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

  const publications = results.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return publications;
};

const getUpdates = async (): Promise<DispositifDesc[]> => {
  const results = await getDispositifAbstracts(
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

  const updates = results.map((d) => ({
    titre: d.titreInformatif,
    url: `${frontUrl}/fr/${d.typeContenu}/${d._id}`,
    abstract: d.abstract,
  }));

  return updates;
};

export const getNewsletterDemarches = async (): ResponseWithData<DemarchesData> => {
  const publications = await getPublications();

  const updates = await getUpdates();

  return { text: "success", data: { publications, updates } };
};
