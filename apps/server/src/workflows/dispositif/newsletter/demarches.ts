import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import type { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import type { DemarchesData, DispositifDesc } from "~/workflows/dispositif/newsletter/types";

const getPublications = async (): Promise<DispositifDesc[]> => {
  const results = await getDispositifAbstracts(
    // prettier-ignore
    {
      typeContenu: "demarche",
      status: "Actif",
      publishedAt: {
        $exists: true,
      },
      // Need to use $expr to compare dates
      $expr: {
        $gte: [
          "$publishedAt",
          {
            $dateSubtract: {
              startDate: "$$NOW",
              unit: "day",
              amount: 30,
            },
          },
        ],
      },
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
    // prettier-ignore
    {
      typeContenu: "demarche",
      status: "Actif",
      lastModificationDate: {
        $exists: true,
      },
      // Need to use $expr to compare dates
      $expr: {
        $gte: [
          "$lastModificationDate",
          {
            $dateSubtract: {
              startDate: "$$NOW",
              unit: "day",
              amount: 30,
            },
          },
        ],
      },
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
