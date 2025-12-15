import type { ProjectionType } from "mongoose";
import { getAirtableUserTable } from "~/connectors/airtable/airtable";
import logger from "~/logger";
import {
  adaptDispositifDepartement,
  getDepartementsFigures,
} from "~/modules/dispositif/dispositif.adapter";
import { getActiveDispositifsFromDBWithoutPopulate } from "~/modules/dispositif/dispositif.repository";
import type { Dispositif } from "~/typegoose";
import type { Response } from "~/types/interface";

const exportDataInAirtable = (data: {
  departement: string;
  region: string;
  nbDispositifs: number;
}) => {
  getAirtableUserTable("Departements RI").create(
    [
      {
        fields: {
          Département: data.departement,
          "Nb dispositifs": data.nbDispositifs,
          Région: data.region,
        },
      },
    ],
    (err: Error) => {
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
  const neededFields: ProjectionType<Dispositif> = { metadatas: 1 };
  const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(neededFields);
  const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
  const depFigures = getDepartementsFigures(adaptedDispositifs);
  depFigures.forEach((data) => {
    exportDataInAirtable(data);
  });

  return { text: "success" };
};
