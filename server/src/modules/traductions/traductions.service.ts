import { Languages } from "@refugies-info/api-types";
import { airtableContentBase } from "../../connectors/airtable/airtable";
import { countDispositifWords, countDispositifWordsForSections } from "../../libs/wordCounter";
import logger from "../../logger";
import { Dispositif, Traductions } from "../../typegoose";

const url = process.env.FRONT_SITE_URL;

interface TradToExport {
  fields: {
    "Quel traducteur ?": string;
    "Dispositif": string;
    "Lien": string;
    "Langues": string;
    "Type": "demarche" | "dispositif";
    "Travail effectué": "à revoir" | "à traduire";
    "Nb mots": number;
  };
}

export const addTradToAirtable = async (dispositif: Dispositif, language: Languages, translation: Traductions, username: string) => {
  const trad: TradToExport = {
    fields: {
      "Quel traducteur ?": username,
      "Dispositif": dispositif.translations?.fr?.content.titreInformatif || "",
      "Lien": `${url}/fr/${dispositif.typeContenu}/${dispositif._id.toString()}`,
      "Langues": language.toUpperCase(),
      "Type": dispositif.typeContenu,
      "Travail effectué": translation.toReviewCache.length > 0 ? "à revoir" : "à traduire",
      "Nb mots": translation.toReviewCache.length > 0 ?
        countDispositifWordsForSections(dispositif.translations.fr, translation.toReviewCache) :
        countDispositifWords(dispositif.translations.fr.content),
    }
  }
  return airtableContentBase("SUIVI TRAD").create([trad], { typecast: true }, (error: Error) => {
    if (error) {
      logger.error("[addTradToAirtable] error while adding trad to airtable", { error });
      return;
    }
    logger.info("[addTradToAirtable] trad successfully added");
  });
}
