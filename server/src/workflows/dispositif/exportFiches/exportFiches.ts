import logger = require("../../../logger");
import { Res } from "../../../types/interface";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(
  process.env.AIRTABLE_BASE_USERS
);

interface Result {
  titreInformatif: string;
  titreMarque: string;
  typeContenu: string;
  lien: string;
  tag1: string;
  tag2: string | null;
  tag3: string | null;
  zoneAction: string;
  ageRequis: string | null;
  publicVise: string | null;
  niveauFrancais: string | null;
  prix: string | null;
  duree: string | null;
  nbVues: number;
}

const getAgeRequis = (infocards: any[]) => {
  const ageRequisIC =
    infocards.filter((card) => card.title === "Âge requis").length > 0
      ? infocards.filter((card) => card.title === "Âge requis")[0]
      : null;
  if (!ageRequisIC) return "";

  if (ageRequisIC.contentTitle === "Plus de ** ans")
    return "Plus de " + ageRequisIC.bottomValue + " ans";
  if (ageRequisIC.contentTitle === "Moins de ** ans")
    return "Moins de " + ageRequisIC.topValue + " ans";

  return (
    "De " + ageRequisIC.bottomValue + " à " + ageRequisIC.topValue + " ans"
  );
};

const getPublicVise = (infocards: any[]) => {
  const publicViseIC =
    infocards.filter((card) => card.title === "Public visé").length > 0
      ? infocards.filter((card) => card.title === "Public visé")[0]
      : null;
  if (!publicViseIC || !publicViseIC.contentTitle) return "";

  return publicViseIC.contentTitle;
};

const getNiveauFrancais = (infocards: any[]) => {
  const niveauFrIC =
    infocards.filter((card) => card.title === "Niveau de français").length > 0
      ? infocards.filter((card) => card.title === "Niveau de français")[0]
      : null;
  if (!niveauFrIC || !niveauFrIC.contentTitle) return "";

  return niveauFrIC.contentTitle;
};

const getDuree = (infocards: any[]) => {
  const dureeIC =
    infocards.filter((card) => card.title === "Durée").length > 0
      ? infocards.filter((card) => card.title === "Durée")[0]
      : null;
  if (!dureeIC || !dureeIC.contentTitle) return "";

  return dureeIC.contentTitle.fr || dureeIC.contentTitle;
};
export const exportFiches = async (_: any, res: Res) => {
  try {
    logger.info("[exportFiches] received");

    const fiches = await getDispositifArray({ status: "Actif" });

    let result: Result[] = [];

    // @ts-ignore
    fiches.forEach((fiche) => {
      turnToLocalizedTitles(fiche, "fr");

      const tag1 =
        fiche.tags &&
        fiche.tags.length > 0 &&
        fiche.tags[0] &&
        fiche.tags[0].name
          ? fiche.tags[0].name
          : "";
      const tag2 =
        fiche.tags &&
        fiche.tags.length > 0 &&
        fiche.tags[1] &&
        fiche.tags[1].name
          ? fiche.tags[1].name
          : "";
      const tag3 =
        fiche.tags &&
        fiche.tags.length > 0 &&
        fiche.tags[2] &&
        fiche.tags[2].name
          ? fiche.tags[2].name
          : "";

      const infocards =
        fiche.contenu &&
        fiche.contenu[1] &&
        fiche.contenu[1].children &&
        fiche.contenu[1].children.length > 0
          ? fiche.contenu[1].children
          : [];

      const ageRequis = getAgeRequis(infocards);
      const publicVise = getPublicVise(infocards);
      const niveauFrancais = getNiveauFrancais(infocards);
      const duree = getDuree(infocards);

      const formattedResult = {
        titreInformatif: fiche.titreInformatif,
        titreMarque: fiche.titreMarque,
        typeContenu: fiche.typeContenu,
        lien: "https://refugies.info/" + fiche.typeContenu + "/" + fiche._id,
        tag1,
        tag2,
        tag3,
        zoneAction: "test",
        ageRequis,
        publicVise,
        niveauFrancais,
        prix: "",
        duree,
        nbVues: fiche.nbVues,
      };

      console.log("formattedResult", formattedResult);
      result.push(formattedResult);
    });

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[exportFiches] error", { error: error.message });
  }
};
