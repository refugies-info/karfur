import type { Languages, TranslatorFeedback } from "@refugies-info/api-types";
import type { Dispositif, LeanTraductions, Theme, Traductions, User } from "@refugies-info/mongo";
import { getAirtableTranslationTable } from "~/connectors/airtable/airtable";
import { countDispositifWords, countDispositifWordsForSections } from "~/libs/wordCounter";
import logger from "~/logger";
import { getDispositifTranslation } from "../dispositif/dispositif.business";

const url = process.env.FRONT_SITE_URL;

interface TradToExport {
  fields: {
    "Quel traducteur ?": string;
    Dispositif: string;
    Lien: string;
    Langues: string;
    Type: "demarche" | "dispositif";
    "Travail effectué": "à revoir" | "à traduire";
    "Nb mots": number;
  };
}

export const addTradToAirtable = async (
  dispositif: Dispositif,
  language: Languages,
  translation: Traductions | LeanTraductions,
  username: string,
) => {
  const toReviewCache = translation.toReviewCache || [];
  const frTranslation = getDispositifTranslation(dispositif, "fr");
  const trad: TradToExport = {
    fields: {
      "Quel traducteur ?": username,
      Dispositif: frTranslation?.content.titreInformatif || "",
      Lien: `${url}/fr/${dispositif.typeContenu}/${dispositif._id.toString()}`,
      Langues: language.toUpperCase(),
      Type: dispositif.typeContenu,
      "Travail effectué": toReviewCache.length > 0 ? "à revoir" : "à traduire",
      "Nb mots":
        toReviewCache.length > 0
          ? countDispositifWordsForSections(frTranslation, toReviewCache)
          : countDispositifWords(frTranslation?.content as any),
    },
  };
  return getAirtableTranslationTable("SUIVI TRAD").create(
    [trad],
    { typecast: true },
    (error: Error) => {
      if (error) {
        logger.error("[addTradToAirtable] error while adding trad to airtable", { error });
        return;
      }
      logger.info("[addTradToAirtable] trad successfully added");
    },
  );
};

interface FeedbackToExport {
  fields: {
    "Pseudo du bénévole": string;
    Expert: string;
    Fiche: string;
    Langue: string;
    "Qualité générale": number;
    Commentaire: string;
    Lien: string;
    Thème: string;
    "Email bénévole": string;
  };
}

export const addFeedbackToAirtable = async (
  translator: User,
  expert: User,
  dispositif: Dispositif,
  language: Languages,
  feedbackRequest: TranslatorFeedback,
) => {
  const feedback: FeedbackToExport = {
    fields: {
      "Pseudo du bénévole": translator.username,
      Expert: expert.username,
      Fiche: getDispositifTranslation(dispositif, "fr")?.content.titreInformatif || "",
      Langue: language.toUpperCase(),
      "Qualité générale": feedbackRequest.note || null,
      Commentaire: feedbackRequest.comment || "",
      Lien: `${url}/fr/${dispositif.typeContenu}/${dispositif._id.toString()}`,
      Thème: (dispositif.theme as unknown as Theme)?.short.fr || "",
      "Email bénévole": translator.email,
    },
  };
  return getAirtableTranslationTable("SUIVI bénévoles").create(
    [feedback],
    { typecast: true },
    (error: Error) => {
      if (error) {
        logger.error("[addFeedbackToAirtable] error while adding feedback to airtable", { error });
        return;
      }
      logger.info("[addFeedbackToAirtable] feedback successfully added");
    },
  );
};
