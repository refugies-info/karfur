var Airtable = require("airtable");
var base = new Airtable({
  apiKey:
    process.env.NODE_ENV === "staging"
      ? process.env.airtableApiKey
      : process.env.AIRTABLE_API_KEY_APPLI,
}).base(
  process.env.NODE_ENV === "staging"
    ? process.env.AIRTABLE_BASE_DIAIR_TEST
    : process.env.AIRTABLE_BASE_TRAD
);

import logger from "../../logger";
import { Res, RequestFromClient } from "../../types/interface";
import { getActiveDispositifsFromDBWithoutPopulate } from "../../modules/dispositif/dispositif.repository";
import { ObjectId } from "mongoose";
import moment from "moment";
import { checkRequestIsFromPostman } from "../../libs/checkAuthorizations";
import { getFormattedLocale } from "../../libs/getFormattedLocale";


const getFormattedAvancement = (
  avancement: Record<string, string> | string
) => {
  // @ts-ignore
  if (!avancement.fr) return [];

  const langues = Object.keys(avancement);
  return langues
    .filter((langue) => langue !== "fr")
    .map((langue) => getFormattedLocale(langue, "short"));
};
const addDispositifInContenusAirtable = (
  title: string,
  link: string,
  tagsList: string[],
  avancement: Record<string, string> | number
) => {
  logger.info("[addDispositifInContenusAirtable] adding a new line", {
    title,
    tagsList,
  });

  // @ts-ignore
  const formattedAvancement = getFormattedAvancement(avancement);
  base("CONTENUS").create(
    [
      {
        fields: {
          "! Titre": title,
          "! Thèmes": tagsList,
          "! Réfugiés.info": link,
          "! À traduire ?": true,
          "! Priorité": ["Normale"],
          "! Type de contenus": ["Dispositif"],
          "! Traduits ?": formattedAvancement,
        },
      },
    ],
    function (err: Error) {
      if (err) {
        logger.error(
          "[addDispositifInContenusAirtable] error while adding a new line",
          { error: err }
        );
        return;
      }
    }
  );

  return;
};

const exportDispositifInAirtable = (
  titleInformatif: string,
  titreMarque: string,
  tags: { short: string }[],
  id: ObjectId,
  avancement: Record<string, string> | number
) => {
  const title = titreMarque + " - " + titleInformatif;
  logger.info("[exportDispositifInAirtable] received a new line", {
    title,
  });
  const link = "https://www.refugies.info/dispositif/" + id;

  const tagsList = tags
    ? tags.filter((tag) => !!tag).map((tag) => tag.short)
    : [];
  const formula = "({! Réfugiés.info} ='" + link + "')";
  const recordsList: { id: string }[] = [];

  base("CONTENUS")
    .select({
      filterByFormula: formula,
    })
    .firstPage(function (err: Error, records: any) {
      if (err) {
        logger.error(
          "[exportDispositifInAirtable] error while getting dispositif in airtable",
          { error: err }
        );
        return;
      }
      records.forEach(function (record: any) {
        logger.info("[exportDispositifInAirtable] retrieved dispositif", {
          recordId: record.id,
          title: record.get("! Titre"),
        });
        recordsList.push({ id: record.id });
      });
      if (recordsList.length === 0) {
        logger.info(
          "[exportDispositifInAirtable] no dispositif with the link exists in table contenu",
          { link }
        );

        addDispositifInContenusAirtable(title, link, tagsList, avancement);

        return;
      }

      logger.info("[exportDispositifInAirtable] dispositif already exists", {
        link,
        recordId: recordsList[0].id,
      });
      return;
    });
};

// route one shot to resynchronize airtable contents with data base
export const updateAirtableContenus = async (
  req: RequestFromClient<{}>,
  res: Res
) => {
  try {
    logger.info("[updateAirtableContenus] received");
    checkRequestIsFromPostman(req.fromPostman);

    const activeDispositifs = await getActiveDispositifsFromDBWithoutPopulate({
      titreInformatif: 1,
      titreMarque: 1,
      tags: 1,
      publishedAt: 1,
      avancement: 1,
    });

    const activeDispositifsIn2021 = activeDispositifs.filter(
      (dispo) => dispo.publishedAt >= moment("2021-01-01")
    );

    activeDispositifsIn2021.forEach((dispositif) => {
      exportDispositifInAirtable(
        dispositif.titreInformatif.fr || dispositif.titreInformatif,
        dispositif.titreMarque.fr || dispositif.titreMarque,
        dispositif.tags,
        dispositif._id,
        dispositif.avancement
      );
    });
    return res.status(200).json({
      nbDispos: activeDispositifsIn2021.length,
      data: activeDispositifsIn2021,
    });
  } catch (error) {
    logger.error("[updateAirtableContenus] error", { error: error.message });
    return res.status(500).json({
      erreur: error.message,
    });
  }
};
