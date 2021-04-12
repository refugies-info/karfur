import { deduplicateArrayOfObjectIds } from "../../libs/deduplicateArrayOfObjectIds";
import logger from "../../logger";
import { updateDispositifInDB } from "./dispositif.repository";
import { DispositifDoc } from "../../schema/schemaDispositif";

//We insert the information of the validated translation inside the dispositif document
//The way it works is by creating a key for each translation in every part of the dispositif, so this is why we create a 'fr' key and move the original text of the dispositif to that.
export const insertInDispositif = async (
  traduction: any,
  locale: string,
  result: DispositifDoc
) => {
  logger.info("[insertInDispositif] received");
  const pointeurs = ["titreInformatif", "titreMarque", "abstract"];

  pointeurs.forEach((x) => {
    // @ts-ignore
    if (!result[x] || !traduction.translatedText[x]) {
      return;
    }
    // @ts-ignore
    if (!result[x].fr) {
      // @ts-ignore
      result[x] = { fr: result[x] };
    }

    // @ts-ignore
    result[x][locale] = traduction.translatedText[x];
  });

  // @ts-ignore
  result.contenu.forEach((p, i) => {
    if (p.title) {
      if (!p.title.fr) {
        p.title = { fr: p.title };
      }
      p.title[locale] = traduction.translatedText.contenu[i].title;
    }
    if (p.content) {
      if (!p.content.fr) {
        p.content = { fr: p.content };
      }
      p.content[locale] = traduction.translatedText.contenu[i].content;
    }
    if (p.children && p.children.length > 0) {
      // @ts-ignore
      p.children.forEach((c, j) => {
        if (
          c.title &&
          traduction.translatedText.contenu[i] &&
          traduction.translatedText.contenu[i].children &&
          traduction.translatedText.contenu[i].children[j] &&
          traduction.translatedText.contenu[i].children[j].title
        ) {
          if (!c.title.fr) {
            c.title = { fr: c.title };
          }
          c.title[locale] =
            traduction.translatedText.contenu[i].children[j].title;
        }
        if (
          c.content &&
          traduction.translatedText.contenu[i] &&
          traduction.translatedText.contenu[i].children &&
          traduction.translatedText.contenu[i].children[j] &&
          traduction.translatedText.contenu[i].children[j].content
        ) {
          if (!c.content.fr) {
            c.content = { fr: c.content };
          }
          c.content[locale] =
            traduction.translatedText.contenu[i].children[j].content;
        }
        if (
          c.contentTitle &&
          traduction.translatedText.contenu[i] &&
          traduction.translatedText.contenu[i].children &&
          traduction.translatedText.contenu[i].children[j] &&
          traduction.translatedText.contenu[i].children[j].contentTitle
        ) {
          if (!c.contentTitle.fr) {
            c.contentTitle = { fr: c.contentTitle };
          }
          c.contentTitle[locale] =
            traduction.translatedText.contenu[i].children[j].contentTitle;
        }
      });
    }
  });

  const translationsToAdd = traduction.traductions
    ? traduction.traductions.map((x: any) => x._id)
    : [];

  const translations = (result.traductions || []).concat(translationsToAdd);
  const deduplicatedTranslations = deduplicateArrayOfObjectIds(translations);

  // @ts-ignore
  result.traductions = deduplicatedTranslations;

  const participantsToAdd = traduction.traductions
    ? traduction.traductions.map((x: any) => (x.userId || {})._id)
    : [];

  const participants = (result.participants || []).concat(participantsToAdd);

  const deduplicatedParticipants = deduplicateArrayOfObjectIds(participants);

  // @ts-ignore
  result.participants = deduplicatedParticipants;

  if (result.avancement === 1) {
    result.avancement = { fr: 1 };
  }
  result.avancement = {
    ...result.avancement,
    [locale]: 1,
  };

  return await updateDispositifInDB(result._id, result);
};
