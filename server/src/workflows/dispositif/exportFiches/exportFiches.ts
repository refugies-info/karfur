import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { getDispositifsForExport } from "../../../modules/dispositif/dispositif.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Dispositif, Langue } from "../../../typegoose";
import { Languages } from "@refugies-info/api-types";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.airtableApiKey }).base(process.env.AIRTABLE_BASE_USERS);

interface Result {
  [translatedTitleKey: string]: any;
  "Titre informatif": string;
  "Titre marque": string;
  "Type de contenu": string[];
  "Lien": string;
  "Thème principal": string;
  "Thème secondaire 1": string | null;
  "Thème secondaire 2": string | null;
  "Zone d'action": string;
  "Age requis": string | null;
  "Public visé": string | null;
  "Niveau de français": string[] | null;
  "Combien ça coute": string | null;
  "Durée": string | null;
  "Nombre de vues": number;
  "Besoins": string[];
  "Date de dernière mise à jour": string;
}

const getTranslatedTitles = (dispositif: Dispositif, activeLanguages: Langue[]) => {
  const translatedTitles: Record<string, string> = {};
  for (const ln of activeLanguages) {
    translatedTitles[`Titre informatif ${ln.i18nCode}`] =
      dispositif.translations?.[ln.i18nCode as Languages]?.content.titreInformatif || "";
  }
  return translatedTitles;
};

const getAgeRequis = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.age) return "";

  if (metadatas.age.type === "moreThan") return "Plus de " + metadatas.age.ages[0] + " ans";
  if (metadatas.age.type === "lessThan") return "Moins de " + metadatas.age.ages[0] + " ans";

  return "De " + metadatas.age.ages[0] + " à " + metadatas.age.ages[1] + " ans";
};

const getPublicVise = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.public) return "";
  return metadatas.public.join(" / ");
};

const getNiveauFrancais = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.frenchLevel) return [];
  return metadatas.frenchLevel.map((f) => f.toString());
};

const getPrice = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.price) return "";
  if (metadatas.price.values?.[0] === 0) return "Gratuit";
  return "Payant";
};

const getZoneAction = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.location || metadatas.location.length === 0) return "";
  return Array.isArray(metadatas.location) ? metadatas.location.join(" / ") : metadatas.location;
};

const exportFichesInAirtable = (fiches: { fields: Result }[]) => {
  logger.info(`[exportFichesInAirtable] export ${fiches.length} fiches in airtable`);
  base("Fiches").create(fiches, { typecast: true }, function (err: Error) {
    if (err) {
      logger.error("[exportFichesInAirtable] error while exporting fiches to airtable", {
        fichesId: fiches.map((fiche) => fiche.fields.Lien),
        error: err,
      });
      return;
    }

    logger.info(`[exportFichesInAirtable] successfully exported ${fiches.length}`);
  });
};

const formatDispositif = (dispositif: Dispositif, activeLanguages: Langue[]) => {
  const translatedTitles = getTranslatedTitles(dispositif, activeLanguages);
  const ageRequis = getAgeRequis(dispositif.metadatas);
  const publicVise = getPublicVise(dispositif.metadatas);
  const niveauFrancais = getNiveauFrancais(dispositif.metadatas);
  const duree = ""; //getDuree(dispositif.metadatas);
  const prix = getPrice(dispositif.metadatas);
  const zoneAction = getZoneAction(dispositif.metadatas);
  const besoins = dispositif.getNeeds().map((need) => need.fr.text);
  const secondaryThemes = dispositif.getSecondaryThemes();

  const formattedResult = {
    "Titre informatif": dispositif.translations.fr.content.titreInformatif,
    "Titre marque": dispositif.translations.fr.content.titreMarque || "",
    "Type de contenu": [dispositif.typeContenu],
    "Lien": "https://refugies.info/fr/" + dispositif.typeContenu + "/" + dispositif._id,
    "Thème principal": dispositif.getTheme()?.short?.fr || "",
    "Thème secondaire 1": secondaryThemes[0]?.short?.fr || "",
    "Thème secondaire 2": secondaryThemes[1]?.short?.fr || "",
    "Zone d'action": zoneAction,
    "Age requis": ageRequis,
    "Public visé": publicVise,
    "Niveau de français": niveauFrancais,
    "Combien ça coute": prix,
    "Durée": duree,
    "Nombre de vues": dispositif.nbVues || 0,
    "Besoins": besoins,
    ...translatedTitles,
    "Date de dernière mise à jour": dispositif.updatedAt.toISOString(),
  };

  return { fields: formattedResult };
};

// TODO: test
export const exportFiches = async (): Response => {
  logger.info("[exportFiches] received");

  const dispositifs = await getDispositifsForExport();
  const activeLanguages = (await getActiveLanguagesFromDB()).filter((ln) => ln.i18nCode !== "fr");

  let result: { fields: Result }[] = [];
  dispositifs.forEach((dispositif) => {
    try {
      const formattedDispositif = formatDispositif(dispositif, activeLanguages);
      result.push(formattedDispositif);
      if (result.length === 10) {
        exportFichesInAirtable(result);
        result = [];
      }
      return;
    } catch (error) {
      logger.error("error with fiche", {
        _id: dispositif._id,
        error: error.message,
      });
    }
  });

  if (result.length > 0) {
    exportFichesInAirtable(result);
  }

  return { text: "success" };
};
