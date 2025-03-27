import { getDispositifAbstracts } from "~/modules/dispositif/dispositif.repository";
import { ResponseWithData } from "~/types/interface";
import { frontUrl } from "~/workflows/dispositif/newsletter/constants";
import { DispositifsData } from "~/workflows/dispositif/newsletter/types";

export const getPublications = async (departement: string): ResponseWithData<DispositifsData> => {
  const results = await getDispositifAbstracts(
    // prettier-ignore
    {
      typeContenu: "dispositif",
      status: "Actif",
      metadatas: {
        location: departement,
      },
      publishedAt: {
        $exists: true,
      },
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

  return { text: "success", data: { publications } };
};
