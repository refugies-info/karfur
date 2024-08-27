import { airtableUserBase } from "~/connectors/airtable/airtable";
import logger from "~/logger";
import { adaptDispositifDepartement, getDepartementsFigures } from "~/modules/dispositif/dispositif.adapter";
import { getActiveDispositifsFromDBWithoutPopulate } from "~/modules/dispositif/dispositif.repository";
import { Response } from "~/types/interface";

const exportDataInAirtable = (data: { departement: string; region: string; nbDispositifs: number }) => {
  airtableUserBase("Departements RI").create(
    [
      {
        fields: {
          "Département": data.departement,
          "Nb dispositifs": data.nbDispositifs,
          "Région": data.region,
        },
      },
    ],
    function (err: Error) {
      if (err) {
        logger.error("[exportDataInAirtable] error while exporting data to airtable", {
          dep: data.departement,
          region: data.region,
          nb: data.nbDispositifs,
          error: err.message,
        });
        return;
      }

      logger.info("[exportDataInAirtable] successfully exported data", {
        dep: data.departement,
        region: data.region,
        nb: data.nbDispositifs,
      });
    },
  );
};

export const exportDispositifsGeolocalisation = async (): Response => {
  logger.info("[exportDispositifsGeolocalisation] received");
  const neededFields = { metadatas: 1 };
  const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(neededFields);
  const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
  const depFigures = getDepartementsFigures(adaptedDispositifs);
  depFigures.forEach((data) => {
    exportDataInAirtable(data);
  });

  return { text: "success" };
};
