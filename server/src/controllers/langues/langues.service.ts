import { Res } from "../../types/interface";
import { Langue, LangueDoc } from "../../schema/schemaLangue";
import { Dispositif } from "../../schema/schemaDispositif";
import { Traduction } from "../../schema/schemaTraduction";
import { asyncForEach } from "../../libs/asyncForEach";
import logger from "../../logger";

export const getLanguages = async (req: {}, res: Res) => {
  try {
    const activeLanguages = await Langue.find(
      { avancement: { $gt: 0 } },
      {
        langueFr: 1,
        langueLoc: 1,
        langueCode: 1,
        i18nCode: 1,
        avancement: 1,
        avancementTrad: 1,
      }
    ).sort({
      avancement: -1,
    });

    const result = activeLanguages.map((langue) => {
      if (langue.avancementTrad && langue.avancementTrad > 1)
        return { ...langue.toJSON(), avancementTrad: 1 };

      return langue;
    });

    res.status(200).json({
      text: "Succès",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ text: "Erreur interne", error });
  }
};

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
