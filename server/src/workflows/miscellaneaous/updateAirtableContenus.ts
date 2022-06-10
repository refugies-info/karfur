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
import { getActiveContents } from "../../modules/dispositif/dispositif.repository";
import { ObjectId } from "mongoose";
import { checkRequestIsFromPostman } from "../../libs/checkAuthorizations";
import { getFormattedLocale } from "../../libs/getFormattedLocale";
import { getDispositifDepartments } from "../../libs/getDispositifDepartments";


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
const addOrUpdateDispositifInContenusAirtable = async (
  id: string | null,
  title: string,
  link: string,
  tagsList: string[],
  avancement: Record<string, string> | number,
  type: "demarche" | "dispositif",
  departments: string[]
) => {
  try {
    // @ts-ignore
    const formattedAvancement = getFormattedAvancement(avancement);
    const fields = {
      "! Titre": title,
      "! Thèmes": tagsList,
      "! Traduits ?": formattedAvancement,
      "! Départements": departments
    };
  if (id) {
    logger.info("[addOrUpdateDispositifInContenusAirtable] updating a line", { title });
    await base("CONTENUS").update(
      [{ id, fields }], { typecast: true }
    );
  } else {
    logger.info("[addOrUpdateDispositifInContenusAirtable] adding a new line", { title });
    await base("CONTENUS").create(
      [{
        fields: {
          ...fields,
          "! À traduire ?": true,
          "! Priorité": ["Normale"],
          "! Réfugiés.info": link,
          "! Type de contenus":
            type === "demarche" ? ["Démarche"] : ["Dispositif"],
        }
      }], { typecast: true }
    );
  }
  } catch (e) {
    logger.error("[addOrUpdateDispositifInContenusAirtable] error while adding a new line", e)
  }
};

const exportDispositifInAirtable = (
  titleInformatif: string,
  titreMarque: string,
  tags: { short: string }[],
  id: ObjectId,
  avancement: Record<string, string> | number,
  type: "demarche" | "dispositif",
  departments: string[]
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
    .firstPage(async function (err: Error, records: any) {
      try {
        if (err) {
          logger.error(
            "[exportDispositifInAirtable] error while getting dispositif in airtable",
            { error: err }
          );
          return;
        }
        records.forEach(function (record: any) {
          recordsList.push({ id: record.id }); // retrieved dispositif
        });
        if (recordsList.length === 0) { // dispositif not found
          await addOrUpdateDispositifInContenusAirtable(null, title, link, tagsList, avancement, type, departments);
        } else { // dispositif already exists
          await addOrUpdateDispositifInContenusAirtable(recordsList[0].id, title, link, tagsList, avancement, type, departments);
        }
      } catch (e) {
        logger.error("[exportDispositifInAirtable] error ", e);
      }
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

    const activeDispositifs = await getActiveContents({
      titreInformatif: 1,
      titreMarque: 1,
      tags: 1,
      avancement: 1,
      typeContenu: 1,
      contenu: 1,
    });

    activeDispositifs.forEach((dispositif) => {
      exportDispositifInAirtable(
        //@ts-ignore
        dispositif.titreInformatif.fr || dispositif.titreInformatif,
        //@ts-ignore
        dispositif.titreMarque?.fr || dispositif.titreMarque || "",
        //@ts-ignore
        dispositif.tags,
        dispositif._id,
        dispositif.avancement,
        dispositif.typeContenu,
        getDispositifDepartments(dispositif)
      );
    });
    return res.status(200).json({
      nbDispos: activeDispositifs.length,
      data: activeDispositifs.map(d => d._id),
    });
  } catch (error) {
    logger.error("[updateAirtableContenus] error", { error: error.message });
    return res.status(500).json({
      erreur: error.message,
    });
  }
};
