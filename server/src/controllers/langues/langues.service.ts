import { RequestFromClient, Res } from "../../types/interface";
import Langue from "../../schema/schemaLangue";
import Dispositif from "../../schema/schemaDispositif";
import Traduction from "../../schema/schemaTraduction";
import { asyncForEach } from "../../libs/asyncForEach";
import logger from "../../logger";

export const getLanguages = async (req: RequestFromClient, res: Res) => {
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
    )
      .sort({
        avancement: -1,
      })
      .lean();

    res.status(200).json({
      text: "Succès",
      data: activeLanguages,
    });
  } catch (error) {
    res.status(500).json({ text: "Erreur interne", error });
  }
};

export const updateLanguagesAvancement = async (
  req: RequestFromClient,
  res: Res
) => {
  if (!req.fromSite) {
    return res.status(405).json({ text: "Requête bloquée par API" });
  }
  logger.info("[updateLanguagesAvancement] received a call");
  const activeLanguages = await Langue.find(
    { avancement: { $gt: 0 } },
    { i18nCode: 1 }
  ).lean();

  const nbActivesDispositif = await Dispositif.count({ status: "Actif" });

  if (activeLanguages.length > 0) {
    await asyncForEach(
      activeLanguages,
      async (langue: { _id: string; i18nCode: string }) => {
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
      }
    );
  }
  res.status(200).json({
    text: "Succès",
    data: "ok",
  });
};
