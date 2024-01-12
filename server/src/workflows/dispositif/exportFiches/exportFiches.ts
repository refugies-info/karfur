import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { getDispositifsForExport } from "../../../modules/dispositif/dispositif.repository";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { Dispositif, Langue, Need, Theme } from "../../../typegoose";
import { airtableUserBase } from "../../../connectors/airtable/airtable";
import { Languages } from "@refugies-info/api-types";


interface Result {
  [translatedTitleKey: string]: any;
  "Titre informatif": string;
  "Titre marque": string;
  "Type de contenu": string[];
  "Lien": string;
  "Thème principal": string;
  "Thème secondaire 1": string | null;
  "Thème secondaire 2": string | null;
  "Zone d'action": string[];
  "Age requis": string | null;
  "Public visé": string[];
  "Public": string[];
  "Niveau de français": string[];
  "Conditions requises": string[];
  "Combien ça coute": string | null;
  "Engagement": string;
  "Fréquence": string;
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

const getAge = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.age) return "";

  if (metadatas.age.type === "moreThan") return "Plus de " + metadatas.age.ages[0] + " ans";
  if (metadatas.age.type === "lessThan") return "Moins de " + metadatas.age.ages[0] + " ans";

  return "De " + metadatas.age.ages[0] + " à " + metadatas.age.ages[1] + " ans";
};

const getPrice = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.price) return "";
  if (metadatas.price.values?.[0] === 0) return "Gratuit";
  return "Payant";
};

const getLocation = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.location || metadatas.location.length === 0) return [];
  return Array.isArray(metadatas.location) ? metadatas.location : [metadatas.location];
};

const getCommitment = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.commitment) return "";
  if (metadatas.commitment.amountDetails === "between") {
    return `between ${metadatas.commitment.hours[0]} and ${metadatas.commitment.hours[1] || "?"} per ${metadatas.commitment.timeUnit}`
  }
  return `${metadatas.commitment.amountDetails} ${metadatas.commitment.hours[0]} per ${metadatas.commitment.timeUnit}`
};
const getFrequency = (metadatas: Dispositif["metadatas"]) => {
  if (!metadatas.frequency) return "";
  return `${metadatas.frequency.amountDetails} ${metadatas.frequency.hours} ${metadatas.frequency.timeUnit} per ${metadatas.frequency.frequencyUnit}`
};

const exportFichesInAirtable = (fiches: Result[]) => {
  logger.info(`[exportFichesInAirtable] export ${fiches.length} fiches in airtable`);
  airtableUserBase("Fiches").create(fiches.map(fiche => ({ fields: fiche })), { typecast: true }, function (err: Error) {
    if (err) {
      logger.error("[exportFichesInAirtable] error while exporting fiches to airtable", {
        fichesId: fiches.map((fiche) => fiche.Lien),
        error: err,
      });
      return;
    }

    logger.info(`[exportFichesInAirtable] successfully exported ${fiches.length}`);
  });
};

const formatDispositif = (dispositif: Dispositif, activeLanguages: Langue[]): Result => {
  return {
    "Titre informatif": dispositif.translations.fr.content.titreInformatif,
    "Titre marque": dispositif.translations.fr.content.titreMarque || "",
    "Type de contenu": [dispositif.typeContenu],
    "Lien": "https://refugies.info/fr/" + dispositif.typeContenu + "/" + dispositif._id,
    "Thème principal": (dispositif.theme as Theme | undefined)?.short?.fr || "",
    "Thème secondaire 1": (dispositif.secondaryThemes[0] as Theme | undefined)?.short?.fr || "",
    "Thème secondaire 2": (dispositif.secondaryThemes[1] as Theme | undefined)?.short?.fr || "",
    "Zone d'action": getLocation(dispositif.metadatas),
    "Age requis": getAge(dispositif.metadatas),
    "Public visé": dispositif.metadatas.public || [],
    "Public": dispositif.metadatas.publicStatus || [],
    "Niveau de français": dispositif.metadatas.frenchLevel || [],
    "Conditions requises": dispositif.metadatas.conditions || [],
    "Combien ça coute": getPrice(dispositif.metadatas),
    "Engagement": getCommitment(dispositif.metadatas),
    "Fréquence": getFrequency(dispositif.metadatas),
    "Nombre de vues": dispositif.nbVues || 0,
    "Besoins": dispositif.needs.map((need) => (need as Need).fr.text),
    ...getTranslatedTitles(dispositif, activeLanguages),
    "Date de dernière mise à jour": dispositif.updatedAt.toISOString(),
  };
};

export const exportFiches = async (): Response => {
  logger.info("[exportFiches] received");
  const dispositifs = await getDispositifsForExport();
  const activeLanguages = (await getActiveLanguagesFromDB()).filter((ln) => ln.i18nCode !== "fr");

  let result: Result[] = [];
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
    exportFichesInAirtable([result[0]]);
  }

  return { text: "success" };
};
