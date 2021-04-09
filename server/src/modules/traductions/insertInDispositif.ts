// @ts-nocheck
import { Dispositif } from "../../schema/schemaDispositif";
import { deduplicateArrayOfObjectIds } from "../../libs/deduplicateArrayOfObjectIds";
import { addOrUpdateDispositifInContenusAirtable } from "../../controllers/miscellaneous/airtable";
import { updateLanguagesAvancement } from "../../controllers/langues/langues.service";
import logger = require("../../logger");

//We insert the information of the validated translation inside the dispositif document
//The way it works is by creating a key for each translation in every part of the dispositif, so this is why we create a 'fr' key and move the original text of the dispositif to that.
export const insertInDispositif = (
  res: any,
  traduction: any,
  locale: string
) => {
  const pointeurs = ["titreInformatif", "titreMarque", "abstract"];

  return Dispositif.findOne({ _id: traduction.articleId }).exec(
    (err, result) => {
      if (!err && result) {
        pointeurs.forEach((x) => {
          if (!result[x] || !traduction.translatedText[x]) {
            return;
          }
          if (!result[x].fr) {
            result[x] = { fr: result[x] };
          }

          result[x][locale] = traduction.translatedText[x];
          result.markModified(x);
        });

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
        result.markModified("contenu");

        const translationsToAdd = traduction.traductions
          ? traduction.traductions.map((x) => x._id)
          : [];

        const translations = (result.traductions || []).concat(
          translationsToAdd
        );

        const deduplicatedTranslations = deduplicateArrayOfObjectIds(
          translations
        );

        result.traductions = deduplicatedTranslations;

        const participantsToAdd = traduction.traductions
          ? traduction.traductions.map((x) => (x.userId || {})._id)
          : [];

        const participants = (result.participants || []).concat(
          participantsToAdd
        );

        const deduplicatedParticipants = deduplicateArrayOfObjectIds(
          participants
        );

        result.participants = deduplicatedParticipants;

        if (result.avancement === 1) {
          result.avancement = { fr: 1 };
        }
        result.avancement = {
          ...result.avancement,
          [locale]: 1,
        };

        return result.save((err, data) => {
          if (err) {
            res.status(500).json({ text: "Erreur interne" });
          } else {
            res.status(200).json({
              text: "Succès",
              data: data,
            });
            try {
              if (result.typeContenu === "dispositif") {
                addOrUpdateDispositifInContenusAirtable(
                  "",
                  "",
                  result.id,
                  [],
                  locale
                );
              }
            } catch (error) {
              logger.error("error while updating contenu in airtable", {
                error,
              });
            }
            try {
              logger.info("[add_Trad] updating avancement");
              updateLanguagesAvancement();
            } catch (error) {
              logger.error("[add_dispositif] error while updating avancement", {
                error,
              });
            }
          }
          return res;
        });
      }
      res.status(400).json({ text: "Erreur d'identification du dispositif" });
      return res;
    }
  );
};
