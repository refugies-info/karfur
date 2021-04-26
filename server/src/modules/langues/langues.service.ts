import { LangueDoc } from "../../schema/schemaLangue";
import { asyncForEach } from "../../libs/asyncForEach";
import logger from "../../logger";
import {
  getActiveLanguagesFromDB,
  updateLanguageAvancementInDB,
} from "./langues.repository";
import { getActiveContents } from "../dispositif/dispositif.repository";
import { ObjectId } from "mongoose";
import { getPublishedTradIds } from "../traductions/traductions.repository";

export const updateLanguagesAvancement = async () => {
  logger.info("[updateLanguagesAvancement] received a call");
  const activeLanguages = await getActiveLanguagesFromDB();

  const activesContents = await getActiveContents({ _id: 1 });
  const nbActivesContents = activesContents.length;

  if (activeLanguages.length > 0) {
    await asyncForEach(activeLanguages, async (langue: LangueDoc) => {
      let nbPublishedTrad = 0;
      if (langue.i18nCode === "fr") return;

      var pubTrads: ObjectId[] = await getPublishedTradIds(langue.i18nCode);

      activesContents.forEach((content) => {
        if (
          pubTrads.filter((trad) => trad.toString() === content._id.toString())
            .length > 0
        ) {
          nbPublishedTrad++;
          return;
        }
        return;
      });

      logger.info("[updateLanguagesAvancement] before update avancement", {
        language: langue.i18nCode,
        nbActivesContents,
        nbPublishedTrad,
      });

      const tradRatio = nbPublishedTrad / nbActivesContents;

      await updateLanguageAvancementInDB(langue._id, tradRatio);
    });
  }
  logger.info("[updateLanguagesAvancement] successfully updated avancement");
  return;
};
