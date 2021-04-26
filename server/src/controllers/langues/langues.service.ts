import { Langue, LangueDoc } from "../../schema/schemaLangue";
import { Dispositif } from "../../schema/schemaDispositif";
import { Traduction } from "../../schema/schemaTraduction";
import { asyncForEach } from "../../libs/asyncForEach";
import logger from "../../logger";

export const updateLanguagesAvancement = async () => {
  logger.info("[updateLanguagesAvancement] received a call");
  const activeLanguages = await Langue.find(
    { avancement: { $gt: 0 } },
    { i18nCode: 1 }
  );

  const nbActivesDispositif = await Dispositif.count({ status: "Actif" });

  if (activeLanguages.length > 0) {
    await asyncForEach(activeLanguages, async (langue: LangueDoc) => {
      if (langue.i18nCode === "fr") return;
      var pubTrads = await Traduction.distinct("articleId", {
        langueCible: langue.i18nCode,
        status: "Validée",
      });

      const pubTradsCount = pubTrads.length;
      console.log(
        `activeLanguages, nb trad publiées : ${pubTrads} , nb actives dispo : ${nbActivesDispositif}`
      );
      const tradRatio = pubTradsCount / nbActivesDispositif;
      await Langue.findByIdAndUpdate(
        { _id: langue._id },
        { avancementTrad: tradRatio }
      );
    });
  }
  logger.info("[updateLanguagesAvancement] successfully updated avancement");
  return;
};
