import { Res } from "../../../types/interface";
import { Langue } from "../../../schema/schemaLangue";

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
