import { RequestFromClient, Res } from "../../../types/interface";
import logger from "../../../logger";
import { getActiveDispositifsFromDBWithoutPopulate } from "../../../modules/dispositif/dispositif.repository";
import { adaptDispositifDepartement, getDepartementsFigures } from "../../../modules/dispositif/dispositif.adapter";
var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(process.env.AIRTABLE_BASE_USERS);

const exportDataInAirtable = (data: { departement: string; region: string; nbDispositifs: number }) => {
  base("Departements RI").create(
    [
      {
        fields: {
          "Département": data.departement,
          "Nb dispositifs": data.nbDispositifs,
          "Région": data.region
        }
      }
    ],
    function (err: Error) {
      if (err) {
        logger.error("[exportDataInAirtable] error while exporting data to airtable", {
          dep: data.departement,
          region: data.region,
          nb: data.nbDispositifs,
          error: err.message
        });
        return;
      }

      logger.info("[exportDataInAirtable] successfully exported data", {
        dep: data.departement,
        region: data.region,
        nb: data.nbDispositifs
      });
    }
  );
};

export const exportDispositifsGeolocalisation = async (req: RequestFromClient<{}>, res: Res) => {
  try {
    logger.info("[exportDispositifsGeolocalisation] received");
    logger.info("[getNbDispositifsByRegion]");
    const neededFields = { contenu: 1 };
    const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate(neededFields);

    const adaptedDispositifs = adaptDispositifDepartement(activeDispositifs);
    // @ts-ignore FIXME
    const depFigures = getDepartementsFigures(adaptedDispositifs);
    depFigures.forEach((data) => {
      exportDataInAirtable(data);
    });

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[exportDispositifsGeolocalisation] error", {
      error: error.message
    });
    return res.status(500).json({ text: "KO" });
  }
};
